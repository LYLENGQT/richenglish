const redisClient = require("../database/redis");

const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🧹 Cleared ${keys.length} Redis cache keys for ${pattern}`);
    }
  } catch (err) {
    console.error("Error clearing Redis cache:", err);
  }
};

module.exports = clearCache;
