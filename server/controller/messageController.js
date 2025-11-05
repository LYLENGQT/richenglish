const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const { User, Message } = require("../model");
const { StatusCodes } = require("http-status-codes");

const getUsers = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) throw new BadRequestError("Invalid credentials");

  const others = await User.find({ _id: { $ne: id } });

  res.status(StatusCodes.OK).json(others);
};

const getMessage = async (req, res) => {
  const { id: chatPartnerId } = req.params;
  const { id: currentUser } = req.user;

  console.log(chatPartnerId, currentUser);

  if (!chatPartnerId || !currentUser)
    throw new BadRequestError("Invalid parameters");

  const messages = await Message.find({
    $or: [
      { sender_id: currentUser, receiver_id: chatPartnerId },
      { sender_id: chatPartnerId, receiver_id: currentUser },
    ],
  }).sort({ created_at: 1 }); // oldest → newest

  res.status(StatusCodes.OK).json(messages);
};

const sendMessage = async (req, res) => {
  const { text, id: chatPartnerId } = req.body;
  const { id: currentUser } = req.user;

  if (!text || !chatPartnerId)
    throw new BadRequestError("Missing message text or receiver");

  const receiver = await User.findById(chatPartnerId);
  if (!receiver) throw new NotFoundError("Receiver not found");

  const message = await Message.create({
    sender_id: currentUser,
    receiver_id: chatPartnerId,
    message: text,
  });

  res.status(StatusCodes.CREATED).json(message);
};

module.exports = { getUsers, getMessage, sendMessage };
