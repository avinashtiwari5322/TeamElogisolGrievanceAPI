const express = require('express');
const router = express.Router();
const { saveUserRequest } = require('../src/controllers/requestController');
const { authenticateToken } = require('../src/middleware/authMiddleware');

router.post('/save', authenticateToken, saveUserRequest);

module.exports = router;
