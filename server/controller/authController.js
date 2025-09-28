const pool = require('../database/db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require('../errors')
const Teacher = require('../models/Teacher');

const login = async (req, res) => {
    const { email, password } = req.body;
    
    const teacher = await Teacher.findByEmail(email)
    
    if(!teacher) throw new BadRequestError("Invalid Credentials")

    const isValidPassword = await bcrypt.compare(password, teacher.password);

    if (!isValidPassword) throw new BadRequestError("Invalid Credentials")

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
};

module.exports = {
  login
};