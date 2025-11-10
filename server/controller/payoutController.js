const Payout = require("../model/Payout");
const {
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnathoizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const redisClient = require("../database/redis");
const clearCache = require("../helper/clearCache");

const getPayouts = async (req, res) => {
  const cacheKey = "payouts:" + JSON.stringify(req.query);

  // Try to get from cache
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Redis Cache Hit:", cacheKey);
      return res.status(StatusCodes.OK).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

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

  const result = {
    payouts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(result);
};

const getPayout = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `payout:${id}`;

  // Try to get from cache
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Redis Cache Hit:", cacheKey);
      return res.status(StatusCodes.OK).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const payout = await Payout.findById(id).populate("teacher_id", "name email");

  if (!payout) {
    throw new NotFoundError("Payout not found");
  }

  const result = { payout };

  // Cache the result for 5 minutes
  try {
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }

  res.status(StatusCodes.OK).json(result);
};

const addPayout = async (req, res) => {
  const payout = await Payout.create(req.body);

  // Clear cache after creating new payout
  await clearCache("payouts:");

  res.status(StatusCodes.CREATED).json({ payout });
};

const updatePayout = async (req, res) => {
  const { id } = req.params;

  const payout = await Payout.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!payout) {
    throw new NotFoundError("Payout not found");
  }

  // Clear cache after updating
  await clearCache("payouts:");
  await clearCache(`payout:${id}`);

  res.status(StatusCodes.OK).json({ payout });
};

const deletePayout = async (req, res) => {
  const { id } = req.params;

  const payout = await Payout.findByIdAndDelete(id);

  if (!payout) {
    throw new NotFoundError("Payout not found");
  }

  // Clear cache after deleting
  await clearCache("payouts:");
  await clearCache(`payout:${id}`);

  res.status(StatusCodes.OK).json({ message: "Payout deleted successfully" });
};

module.exports = {
  getPayouts,
  getPayout,
  addPayout,
  updatePayout,
  deletePayout,
};
