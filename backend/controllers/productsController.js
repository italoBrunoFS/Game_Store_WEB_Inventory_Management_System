const model = require('../models/productsModel');

const getAllProducts = async (req, res) => {
  try {
    const { nome, tipo, preco_min, preco_max, fabricado_em, estoque_min } = req.query;

    const products = await model.getAllProducts({
      nome: nome || null,
      tipo: tipo || null,
      preco_min: preco_min ? parseFloat(preco_min) : null,
      preco_max: preco_max ? parseFloat(preco_max) : null,
      fabricado_em: fabricado_em || null,
      estoque_min: estoque_min ? parseInt(estoque_min) : null,
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await model.getProductById(req.params.id);
    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = await model.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await model.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto modificado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchProduct = async (req, res) => {
  try {
    const patched = await model.patchProduct(req.params.id, req.body);
    if (!patched) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await model.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchProductByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Nome obrigatório' });
    }

    const products = await model.searchProductByName(name);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReport = async (req, res) => {
  try {
    const report = await model.getReport();
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
