const bcrypt = require('bcryptjs');
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require('../errors')
const Teacher = require('../models/Teacher');
const Token = require('../models/Tokens')
const {signAndStoreToken} = require('../helper/sign');
const { StatusCodes } = require('http-status-codes');

const login = async (req, res) => {
    const { email, password } = req.body;
    
    const teacher = await Teacher.findByEmail(email)
    
    if(!teacher) throw new BadRequestError("Invalid Credentials")

    const isValidPassword = await bcrypt.compare(password, teacher.password);

    if (!isValidPassword) throw new BadRequestError("Invalid Credentials")

    const token = await signAndStoreToken(teacher);

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

const logout = async (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const {email} = req.user

    const revokeToken = await Token.revoke(token, email)

    res.status(StatusCodes.OK).json({success: revokeToken})
}

module.exports = {
  login,
  logout
};