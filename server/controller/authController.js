const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { User } = require("../model/");
const verifyToken = require("../helper/sign");
const generateOTP = require("../helper/generateOTP");
const { sendMail } = require("../lib/nodemailer");

const login = async (req, res) => {
  const { email, password, remember } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new BadRequestError("Invalid Email");
  }

  const isPasswordCorrect = await user.checkPassword(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid Password");
  }

  const token = await user.generateAccessToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 86400000,
  });

  if (remember) {
    const refresh = await user.generateRefreshToken();

    res.cookie("refresh", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 2592000000,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  res.cookie("refresh", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Logged out and tokens expired" });
};

const refresh = async (req, res) => {
  const { token, refresh } = req.cookies;

  if (!refresh || !token) {
    throw new BadRequestError("Invalid");
  }

  const isValidRefresh = await verifyToken(refresh, "refresh");

  if (!isValidRefresh) {
    throw new BadRequestError("Invalid");
  }

  const user = await User.findById(isValidRefresh.id);

  const access_token = await user.generateAccessToken();

  res.cookie("token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 86400000,
  });

  res
    .status(StatusCodes.OK)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) throw new BadRequestError("Invalid");

  const otp = generateOTP().toString();
  user.reset.otp = String(otp);
  user.reset.expiration = new Date(Date.now() + 10 * 30000); // 5mins

  await user.save();

  await sendMail(email, `Forgot Password`, `${otp}`);
  res.status(StatusCodes.OK).json({ message: "email sent" });
};

const resetPassword = async (req, res) => {
  const { otp, newPassword, confirmPassword } = req.body;

  const user = await User.findOne({ "reset.otp": otp });
  if (!user) throw new BadRequestError("Invalid");

  const isExpired = await user.isOTPExpired();
  if (isExpired) throw new BadRequestError("OTP expired");

  user.password = newPassword;
  reset.expiration = null;
  reset.otp = null;

  await user.save();

  res.status(StatusCodes.OK).json({ message: "Password reset successfully" });
};

module.exports = {
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
};
