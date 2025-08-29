const express = require('express');
const router = express.Router();
const { getRequestDetail } = require('../src/controllers/requestDetailController');
const { authenticateToken } = require('../src/middleware/authMiddleware');

router.get('/:requestId', authenticateToken, getRequestDetail);

module.exports = router;
