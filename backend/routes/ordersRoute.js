const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.post('/', ordersController.createOrder);
router.get('/view', ordersController.getOrdersFromView);
router.get('/:id', ordersController.getOrderById);
router.get('/', ordersController.getAllOrders);
router.patch('/:id/status', ordersController.updatePaymentStatus);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
