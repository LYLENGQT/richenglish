const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { Notification } = require("../model");

const getNotification = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new UnauthenticatedError("User not authenticated");

  const notifications = await Notification.find({ user_id: userId }).sort({
    createdAt: -1,
  });

  res.status(StatusCodes.OK).json({ notifications });
};

const createNotification = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new UnauthenticatedError("User not authenticated");

  const { type, message } = req.body;

  if (!type || !message) {
    throw new BadRequestError("Missing required fields: type, message");
  }

  const notification = await Notification.create({
    user_id: userId,
    type,
    message,
  });

  res.status(StatusCodes.CREATED).json({ notification });
};

const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;

  if (!id || typeof is_read === "undefined") {
    throw new BadRequestError("Both id and is_read are required");
  }

  const notification = await Notification.findByIdAndUpdate(
    id,
    { is_read },
    { new: true }
  );

  if (!notification)
    throw new NotFoundError(`Notification with id ${id} not found`);

  res.status(StatusCodes.OK).json({ notification });
};

module.exports = {
  getNotification,
  createNotification,
  updateNotification,
};
