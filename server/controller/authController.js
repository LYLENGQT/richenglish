const pool = require('../database/db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT * FROM teachers WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const teacher = rows[0];
    const isValidPassword = await bcrypt.compare(password, teacher.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, role: teacher.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  login
};