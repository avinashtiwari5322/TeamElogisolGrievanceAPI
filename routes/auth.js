const express = require('express');
const router = express.Router();
const { login } = require('../src/controllers/authController');

router.post('/login', login);

module.exports = router;
