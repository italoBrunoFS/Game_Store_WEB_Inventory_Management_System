const express = require('express');
const router = express.Router();
const {login} = require('../controllers/authController');
const e = require('express');

router.post('/login', login);

module.exports = router;