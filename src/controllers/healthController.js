// src/controllers/healthController.js
const { sql } = require('../interface/db');

const healthCheck = (req, res) => {
  res.json({ status: 'ok' });
};

module.exports = { healthCheck };
