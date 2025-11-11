const redisClient = require("../database/redis");

const clearCache = async (pattern) => {
  try {
    // Use SCAN instead of KEYS for better performance in production
    const keys = [];
    let cursor = "0";

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern + "*",
        COUNT: 100,
      });

      cursor = reply.cursor;
      keys.push(...reply.keys);
    } while (cursor !== "0");

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🧹 Cleared ${keys.length} Redis cache keys for ${pattern}`);
    } else {
      console.log(`🧹 No cache keys found for pattern: ${pattern}`);
    }
  } catch (err) {
    console.error("Error clearing Redis cache:", err);
  }
};

module.exports = clearCache;
