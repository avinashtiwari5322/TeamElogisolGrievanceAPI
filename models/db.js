const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false, // Set to true if using Azure
    trustServerCertificate: true // Change for production
  }
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

module.exports = { sql, connectToDatabase };
