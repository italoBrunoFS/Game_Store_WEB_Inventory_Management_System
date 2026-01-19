const { getDashboard } = require('../models/dashboardModel');

async function getReport(req, res) {
  const { mes, ano } = req.query;

  try {
    const data = await getDashboard(mes, ano);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
}

module.exports = { getReport };
