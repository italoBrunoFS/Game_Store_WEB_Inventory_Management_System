const ordersModel = require('../models/ordersModel');

async function createOrder(req, res) {
  try {
    const { cliente, funcionario_id, forma_pagamento, itens } = req.body;
    const order = await ordersModel.createOrder({ cliente, funcionario_id, forma_pagamento, itens });
    res.status(201).json(order);
  } catch (err) {
    console.error('Erro ao criar pedido:', err.message);
    res.status(400).json({ error: err.message });
  }
}

async function getOrderById(req, res) {
  try {
    const id = req.params.id;
    const order = await ordersModel.getOrderById(id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await ordersModel.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function getOrdersFromView(req, res) {
  try {
    const orders = await ordersModel.getOrdersFromView();
    res.json(orders);
  } catch (err) {
    console.error('Erro ao buscar pedidos da view:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function updatePaymentStatus(req, res) {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const updated = await ordersModel.updatePaymentStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar status:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function deleteOrder(req, res) {
  try {
    const id = req.params.id;
    const deleted = await ordersModel.deleteOrder(id);
    if (!deleted) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar pedido:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersFromView,
  updatePaymentStatus,
  deleteOrder
};
