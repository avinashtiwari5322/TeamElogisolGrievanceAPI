const jwt = require('jsonwebtoken');
const { sql } = require('../interface/db');
const SECRET_KEY = process.env.JWT_SECRET;

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const query = `
      SELECT UM.*, RM.RoleName, CM.CompanyName, CM.Email AS CompanyEmail, CM.Address, CM.Mobile AS CompanyMobile, CM.IsActive AS CompanyIsActive, CM.DelMark AS CompanyDelMark, CM.CreatedBy AS CompanyCreatedBy, CM.CreatedOn AS CompanyCreatedOn
      FROM USER_MASTER UM
      LEFT JOIN ROLE_MASTER RM ON UM.RoleId = RM.RoleId
      LEFT JOIN COMPANY_MASTER CM ON UM.CompanyId = CM.CompanyId
      WHERE UM.Email = @email AND UM.Password = @password AND UM.DelMark = 0
    `;
    const request = new sql.Request();
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);
    const result = await request.query(query);
    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.PasswordExpiryDate && new Date(user.PasswordExpiryDate) < new Date()) {
      return res.status(403).json({ success: false, message: 'Password expired.' });
    }

    // Fetch all users
    const allUsersResult = await sql.query`SELECT * FROM USER_MASTER WHERE DelMark = 0`;
    // Generate JWT token
    const payload = {
      email: user.Email,
      userId: user.UserId,
      date: new Date().toISOString()
    };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login successful',
      accessToken: token,
      user: {
        userId: user.UserId,
        userName: user.UserName,
        email: user.Email, 
        mobile: user.Mobile, 
        role: user.RoleName,
        userType: user.UserType,
        passwordExpiryDate: user.PasswordExpiryDate,
        company: {
          companyId: user.CompanyId,
          companyName: user.CompanyName,
          companyEmail: user.CompanyEmail,
          address: user.Address,
          mobile: user.CompanyMobile, 
          isActive: user.CompanyIsActive,
          delMark: user.CompanyDelMark,
          createdBy: user.CompanyCreatedBy,
          createdOn: user.CompanyCreatedOn
        }
      },

    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { login };
