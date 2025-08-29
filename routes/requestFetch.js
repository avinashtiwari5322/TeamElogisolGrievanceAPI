const express = require('express');
const router = express.Router();
const { fetchUserRequests } = require('../src/controllers/requestFetchController');
const { authenticateToken } = require('../src/middleware/authMiddleware');

router.post('/fetch', authenticateToken, fetchUserRequests);

module.exports = router;
