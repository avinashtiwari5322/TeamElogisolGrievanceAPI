const express = require('express');
const router = express.Router();
const { getPriorityList, getRequestTypeList } = require('../src/controllers/masterController');
const { authenticateToken } = require('../src/middleware/authMiddleware');

router.get('/priority-list', authenticateToken, getPriorityList);
router.get('/request-type-list', authenticateToken, getRequestTypeList);

module.exports = router;
