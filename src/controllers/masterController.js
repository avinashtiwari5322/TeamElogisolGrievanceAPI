// src/controllers/masterController.js
const { sql } = require('../interface/db');

async function getPriorityList(req, res) {
  try {
  const result = await sql.query`SELECT PriorityId, PriorityName FROM PRIORITY_MASTER WHERE DelMark = 0 AND IsActive = 1`;
  const priorities = result.recordset.map(row => ({ id: row.PriorityId, name: row.PriorityName }));
  res.json({ success: true, priorities });
  } catch (err) {
    console.error('Error fetching priorities:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

async function getRequestTypeList(req, res) {
  try {
  const result = await sql.query`SELECT RequestTypeId, RequestType FROM REQUEST_TYPE_MASTER WHERE DelMark = 0 AND IsActive = 1`;
  const requestTypes = result.recordset.map(row => ({ id: row.RequestTypeId, name: row.RequestType }));
  res.json({ success: true, requestTypes });
  } catch (err) {
    console.error('Error fetching request types:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { getPriorityList, getRequestTypeList };
