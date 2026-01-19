const pool = require('../db/db');

async function createOrder({ cliente, funcionario_id, forma_pagamento, itens }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let valorTotal = 0;
    for (const item of itens) {
      const [rows] = await conn.query(
        'SELECT preco, quantidade_estoque FROM produto WHERE id_produto = ?',
        [item.produto_id]
      );
      if (!rows[0]) throw new Error(`Produto ${item.produto_id} não encontrado`);
      if (rows[0].quantidade_estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para produto ${item.produto_id}`);
      }
      valorTotal += Number(rows[0].preco) * item.quantidade;
    }

    await conn.query('CALL sp_calcular_desconto(?, ?, @p_desconto)', [
      cliente.id_cliente,
      valorTotal,
    ]);
    const [[{ desconto }]] = await conn.query('SELECT @p_desconto AS desconto');
    const valorFinal = valorTotal - Number(desconto);

    const [resultCompra] = await conn.query(
      `INSERT INTO compra 
        (cliente_id, funcionario_id, data_compra, valor_total, desconto_aplicado, status_pagamento, forma_pagamento) 
       VALUES (?, ?, NOW(), ?, ?, 'Aguardando', ?)`,
      [cliente.id_cliente, funcionario_id, valorFinal, desconto, forma_pagamento]
    );

    const compraId = resultCompra.insertId;

    for (const item of itens) {
      const [rows] = await conn.query(
        'SELECT preco FROM produto WHERE id_produto = ?',
        [item.produto_id]
      );
      const precoUnitario = Number(rows[0].preco);
      const subtotal = precoUnitario * item.quantidade;

      await conn.query(
        `INSERT INTO itemCompra (compra_id, produto_id, quantidade, preco_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [compraId, item.produto_id, item.quantidade, precoUnitario, subtotal]
      );
    }

    await conn.commit();
    return await getOrderById(compraId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getOrderById(id) {
  const [compra] = await pool.query('SELECT * FROM compra WHERE id_compra = ?', [id]);
  if (!compra[0]) return null;

  const [itens] = await pool.query(
    `SELECT ic.*, p.nome as produto_nome 
     FROM itemCompra ic
     JOIN produto p ON ic.produto_id = p.id_produto
     WHERE ic.compra_id = ?`,
    [id]
  );

  return {
    ...compra[0],
    valor_total: Number(compra[0].valor_total),
    desconto_aplicado: Number(compra[0].desconto_aplicado),
    itens: itens.map((i) => ({
      ...i,
      preco_unitario: Number(i.preco_unitario),
      subtotal: Number(i.subtotal),
    })),
  };
}

async function getAllOrders() {
  const [rows] = await pool.query(
    `SELECT c.*, cl.nome as cliente_nome, f.nome as funcionario_nome 
     FROM compra c
     JOIN cliente cl ON c.cliente_id = cl.id_cliente
     JOIN funcionario f ON c.funcionario_id = f.id_funcionario
     ORDER BY c.id_compra DESC`
  );

  const ordersWithItems = await Promise.all(
    rows.map(async (order) => {
      const [itens] = await pool.query(
        `SELECT ic.*, p.nome as produto_nome
         FROM itemCompra ic
         JOIN produto p ON ic.produto_id = p.id_produto
         WHERE ic.compra_id = ?`,
        [order.id_compra]
      );

      return {
        ...order,
        valor_total: Number(order.valor_total),
        desconto_aplicado: Number(order.desconto_aplicado),
        itens: itens.map((i) => ({
          ...i,
          preco_unitario: Number(i.preco_unitario),
          subtotal: Number(i.subtotal),
        })),
      };
    })
  );

  return ordersWithItems;
}

async function updatePaymentStatus(id, status) {
  const [result] = await pool.query(
    'UPDATE compra SET status_pagamento = ? WHERE id_compra = ?',
    [status, id]
  );
  return result.affectedRows > 0;
}

async function deleteOrder(id) {
  const [result] = await pool.query('DELETE FROM compra WHERE id_compra = ?', [id]);
  return result.affectedRows > 0;
}


async function getOrdersFromView() {
  const [rows] = await pool.query('SELECT * FROM vw_ordens_com_itens ORDER BY id_compra DESC');
  return rows.map((row) => ({
    ...row,
    valor_total: Number(row.valor_total),
    desconto_aplicado: Number(row.desconto_aplicado),
    preco_unitario: row.preco_unitario ? Number(row.preco_unitario) : null,
    produto_preco: row.produto_preco ? Number(row.produto_preco) : null,
  }));
}

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updatePaymentStatus,
  deleteOrder,
  getOrdersFromView,
};
