const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

router.get('/', productsController.getAllProducts);
router.get('/search', productsController.searchProductByName);
router.get('/report', productsController.getReport);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.patch('/:id',productsController.patchProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;