const Payout = require("../model/Payout");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getPayouts = async (req, res) => {
  const query = {};
  const allowedFilters = ["teacher_id", "status", "start_date", "end_date"];

  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      query[field] = req.query[field];
    }
  });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const payouts = await Payout.find(query)
    .populate("teacher_id", "name email")
    .skip(skip)
    .limit(limit);

  const total = await Payout.countDocuments(query);

  res.status(StatusCodes.OK).json({
    payouts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const getPayout = async (req, res) => {
  const { id } = req.params;
  const payout = await Payout.findById(id).populate("teacher_id", "name email");

  if (!payout) throw new NotFoundError("Payout not found");

  res.status(StatusCodes.OK).json({ payout });
};

const addPayout = async (req, res) => {
  const payout = await Payout.create(req.body);
  res.status(StatusCodes.CREATED).json({ payout });
};

const updatePayout = async (req, res) => {
  const { id } = req.params;
  const payout = await Payout.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!payout) throw new NotFoundError("Payout not found");

  res.status(StatusCodes.OK).json({ payout });
};

const deletePayout = async (req, res) => {
  const { id } = req.params;
  const payout = await Payout.findByIdAndDelete(id);

  if (!payout) throw new NotFoundError("Payout not found");

  res.status(StatusCodes.OK).json({ message: "Payout deleted successfully" });
};

module.exports = {
  getPayouts,
  getPayout,
  addPayout,
  updatePayout,
  deletePayout,
};
