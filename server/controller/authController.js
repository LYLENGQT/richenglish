const { StatusCodes } = require("http-status-codes");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { User } = require("../model/");

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
