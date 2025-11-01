const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const Teacher = require("../models/Users");
const Message = require("../models/Message");
const { StatusCodes } = require("http-status-codes");
const { getIO } = require("../lib/socket");

const getTeachers = async (req, res) => {
  const { id } = req.user;

  const teacher = await Teacher.findById(id);

  if (!teacher) throw new BadRequestError("Invalid Credentials");

  const others = await Teacher.findAll(id);
  const unreadCounts = await Message.getUnreadCountsBySender(id);

  const unreadMap = unreadCounts.reduce((acc, { senderId, unreadCount }) => {
    acc[senderId] = unreadCount;
    return acc;
  }, {});

  const enriched = others.map((teacher) => ({
    ...teacher,
    unreadCount: unreadMap[teacher.id] || 0,
  }));

  res.status(StatusCodes.OK).json(enriched);
};

const getMessage = async (req, res) => {
  const { id: chatPartnerId } = req.params;
  const { id: currentUser } = req.user;

  if (!chatPartnerId || !currentUser) throw new BadRequestError("Invalid");

  const messages = await Message.getMessagesBetweenUsers(
    currentUser,
    chatPartnerId
  );

  await Message.markMessagesAsRead(currentUser, chatPartnerId);

  res.status(StatusCodes.OK).json(messages);
};

const sendMessage = async (req, res) => {
  const { text, id: chatPartnerId } = req.body;
  const { id: currentUser } = req.user;

  const send = await Message.createMessage(currentUser, chatPartnerId, text);

  const [message] = await Message.getMessagebyId(send.insertId);

  const io = getIO();
  io.to(chatPartnerId).emit("receiveMessage", message);

  res.status(StatusCodes.OK).json(message);
};

module.exports = { getTeachers, getMessage, sendMessage };
