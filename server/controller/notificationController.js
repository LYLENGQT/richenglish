const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Notification = require("../models/Notification");

const getNotification = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new UnauthenticatedError("User not authenticated");

  const notifications = await Notification.findNotification(userId);
  res.status(StatusCodes.OK).json(notifications);
};

const createNotification = async (req, res) => {
  const { id, type, message } = req.body;
  const userId = req.user?.id;
  if (!userId) throw new UnauthenticatedError("User not authenticated");

  if (!id || !type || !message) {
    throw new BadRequestError("Missing required fields: id, type, message");
  }

  const result = await Notification.createNotification({
    id,
    user_id: userId,
    type,
    message,
  });
  res.status(StatusCodes.CREATED).json(result);
};

const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;

  if (!id || typeof is_read === "undefined") {
    throw new BadRequestError("Both id and is_read are required");
  }

  const result = await Notification.updateNotification({ id, is_read });
  if (!result.success)
    throw new NotFoundError(`Notification with id ${id} not found`);

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getNotification,
  createNotification,
  updateNotification,
};
