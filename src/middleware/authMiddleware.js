// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required.' });
  }
  try {
    // Use only the secret from .env for validation
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token validation failed.' });
  }
}

module.exports = { authenticateToken };
