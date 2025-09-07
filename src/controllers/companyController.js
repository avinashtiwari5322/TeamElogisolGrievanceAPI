// src/controllers/companyController.js
const { sql } = require('../interface/db');

async function getAllCompanies(req, res) {
  try {
    const result = await sql.query`SELECT CompanyId, CompanyName FROM COMPANY_MASTER WHERE IsActive = 1 AND DelMark = 0`;
    const companies = result.recordset.map(row => ({
      companyId: row.CompanyId,
      companyName: row.CompanyName
    }));
    res.json({ success: true, companies });
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { getAllCompanies };
