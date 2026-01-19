const pool = require('../db/db');

async function getAllProducts(filters = {}) {
  const {
    nome = null,
    tipo = null,
    preco_min = null,
    preco_max = null,
    fabricado_em = null,
    estoque_min = null
  } = filters;

  const [rows] = await pool.query(
    'CALL sp_filter_products(?, ?, ?, ?, ?, ?)',
    [
      nome,
      tipo,
      preco_min,
      preco_max,
      fabricado_em,
      estoque_min
    ]
  );

  return rows[0];
}

async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM produto WHERE id_produto = ?', [id]);
  return rows;
}

async function createProduct({ nome, tipo, fabricante, preco, descricao, quantidade_estoque, garantia_meses, fabricado_em }) {
  const [result] = await pool.query(
    'INSERT INTO produto (nome, tipo, fabricante, preco, descricao, quantidade_estoque, garantia_meses, fabricado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nome, tipo, fabricante, parseFloat(preco), descricao, parseInt(quantidade_estoque), parseInt(garantia_meses), fabricado_em]
  );

  return { id_produto: result.insertId, nome, tipo, fabricante, preco, descricao, quantidade_estoque, garantia_meses, fabricado_em };
}

async function updateProduct(id, { nome, tipo, fabricante, preco, descricao, quantidade_estoque, garantia_meses, fabricado_em }) {
  const [result] = await pool.query(
    'UPDATE produto SET nome = ?, tipo = ?, fabricante = ?, preco = ?, descricao = ?, quantidade_estoque = ?, garantia_meses = ?, fabricado_em = ? WHERE id_produto = ?',
    [nome, tipo, fabricante, parseFloat(preco), descricao, parseInt(quantidade_estoque), parseInt(garantia_meses), fabricado_em, id]
  );

  return result.affectedRows > 0;
}

async function patchProduct(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return false;

  const setClause = keys.map(key => `${key} = ?`).join(', ');

  const [result] = await pool.query(
    `UPDATE produto SET ${setClause} WHERE id_produto = ?`,
    [...values, id]
  );

  return result.affectedRows > 0;
}

async function deleteProduct(id) {
  const [result] = await pool.query('DELETE FROM produto WHERE id_produto = ?', [id]);
  return result.affectedRows > 0;
}

async function searchProductByName(nome) {
  const [rows] = await pool.query(
    'SELECT * FROM produto WHERE TRIM(LOWER(nome)) LIKE TRIM(LOWER(?))',
    [`%${nome}%`]
  );
  return rows;
}

async function getReport() {
  const [totais] = await pool.query(`
    SELECT 
      COUNT(*) AS total_produtos,
      SUM(preco * quantidade_estoque) AS valor_total_estoque,
      SUM(quantidade_estoque) AS quantidade_total
    FROM produto
  `);

  const [porTipo] = await pool.query(`
    SELECT tipo, COUNT(*) AS quantidade
    FROM produto
    GROUP BY tipo
  `);

  return {
    ...totais[0],
    produtos_por_tipo: porTipo
  };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  searchProductByName,
  getReport
};
