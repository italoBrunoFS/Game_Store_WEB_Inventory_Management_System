const express = require('express');
const router = express.Router();
const { getReport } = require('../controllers/dashboardController');

router.get('/', getReport);

module.exports = router;
