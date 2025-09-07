const express = require('express');
const router = express.Router();
const { getAllCompanies } = require('../src/controllers/companyController');
const { authenticateToken } = require('../src/middleware/authMiddleware');

router.get('/all', authenticateToken, getAllCompanies);

module.exports = router;
