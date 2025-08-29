const express = require('express');
const router = express.Router();
const { healthCheck } = require('../src/controllers/healthController');

router.get('/', healthCheck);

module.exports = router;
