const bcrypt = require("bcryptjs");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const Teacher = require("../models/Users");
const Token = require("../models/Tokens");
const { signAndStoreToken } = require("../helper/sign");
const { StatusCodes } = require("http-status-codes");

const login = async (req, res) => {
  const { email, password, remember } = req.body;

  const teacher = await Teacher.findByEmail(email);

  if (!teacher) throw new BadRequestError("Invalid Credentials");

  const isValidPassword = await bcrypt.compare(password, teacher.password);

  if (!isValidPassword) throw new BadRequestError("Invalid Credentials");

  const token = await signAndStoreToken(teacher);
  const refresh = await signAndStoreToken(teacher, "refresh", "1m");

  res.cookie("token", token, {
    httpOnly: true, // prevents client-side JS access
    secure: true, // send only over HTTPS
    sameSite: "None", // mitigates CSRF
    maxAge: 86400000, // 1 day in milliseconds
  });

  if (remember) {
    res.cookie("refresh", token, {
      httpOnly: true, // prevents client-side JS access
      secure: true, // send only over HTTPS
      sameSite: "None", // mitigates CSRF
      maxAge: 2592000000, // 1 month (30 days) in milliseconds
    });
  }

  res.json({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    role: teacher.role,
  });
};

const logout = async (req, res) => {
  const { token } = req.cookies;

  const { email } = req.user;

  const revokeToken = await Token.revoke(token, email);

  res.status(StatusCodes.OK).json({ success: revokeToken });
};

const refresh = async (req, res) => {
  const { token, refresh } = req.cookies;

  const user = await Token.findUserByToken(refresh);

  if (token) {
    const revokeToken = await Token.revokeViaToken(token);
  }

  if (!user) {
    throw new BadRequestError("Invalid");
  }

  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  login,
  logout,
  refresh,
};
