const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const Teacher = require("../models/Users");
const Message = require("../models/Message");
const { StatusCodes } = require("http-status-codes");

const getTeachers = async (req, res) => {
  const { id } = req.user;

  const teacher = await Teacher.findById(id);

  if (!teacher) throw new BadRequestError("Invalid Credentials");

  const others = await Teacher.findAll(id);

  res.status(StatusCodes.OK).json(others);
};

const getMessage = async (req, res) => {
  const { id: chatPartnerId } = req.params;
  const { id: currentUser } = req.user;

  if (!chatPartnerId || !currentUser) throw new BadRequestError("Invalid");

  const messages = await Message.getMessagesBetweenUsers(
    currentUser,
    chatPartnerId
  );

  res.status(StatusCodes.OK).json(messages);
};

const sendMessage = async (req, res) => {
  const { text, id: chatPartnerId } = req.body;
  const { id: currentUser } = req.user;

  const send = await Message.createMessage(currentUser, chatPartnerId, text);

  const message = await Message.getMessagebyId(send.insertId);

  res.status(StatusCodes.OK).json(message);
};

module.exports = { getTeachers, getMessage, sendMessage };
