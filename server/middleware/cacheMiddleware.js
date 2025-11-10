const redisClient = require("../database/redis");

const cache = (prefix) => async (req, res, next) => {
  try {
    const key = prefix + JSON.stringify(req.query || req.params);

    const cached = await redisClient.get(key);
    if (cached) {
      console.log("⚡ Redis Cache Hit:", key);
      return res.status(200).json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redisClient.setEx(key, 300, JSON.stringify(body)); // cache for 5 minutes
      return originalJson(body);
    };

    next();
  } catch (err) {
    next();
  }
};

module.exports = cache;
