const pool = require('../db/db');

async function getDashboard(mes, ano) {
  const conn = await pool.getConnection();
  try {
    const today = new Date();
    const month = mes ? Number(mes) : today.getMonth() + 1;
    const year = ano ? Number(ano) : today.getFullYear();

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    const [vendasDetalhadas] = await conn.query(
      `SELECT * FROM vw_vendas_por_funcionario
       WHERE data_compra BETWEEN ? AND ?
       ORDER BY id_funcionario, data_compra`,
      [monthStart, monthEnd]
    );

    const [vendasPorFuncionario] = await conn.query(
      `SELECT
         id_funcionario,
         funcionario_nome,
         COUNT(id_compra) AS total_compra,
         SUM(valor_total) AS total_vendas
       FROM vw_vendas_por_funcionario
       WHERE data_compra BETWEEN ? AND ?
       GROUP BY id_funcionario, funcionario_nome`,
      [monthStart, monthEnd]
    );

    const [produtosPoucoEstoque] = await conn.query('SELECT * FROM vw_produtos_pouco_estoque');

    const [produtosSemEstoque] = await conn.query('SELECT * FROM vw_produtos_sem_estoque');

    const [produtoMaisVendido] = await conn.query(
      `SELECT id_produto, nome, SUM(total_vendido) AS total_vendido
       FROM vw_produto_mais_vendido
       WHERE data_compra BETWEEN ? AND ?
       GROUP BY id_produto, nome
       ORDER BY total_vendido DESC
       LIMIT 1`,
      [monthStart, monthEnd]
    );

    const [[geral]] = await conn.query('SELECT * FROM vw_dashboard_geral');

    return {
      vendasDetalhadas,
      vendasPorFuncionario,
      produtosPoucoEstoque,
      produtosSemEstoque,
      produtoMaisVendido: produtoMaisVendido || null,
      ...geral,
    };
  } finally {
    conn.release();
  }
}

module.exports = { getDashboard };
