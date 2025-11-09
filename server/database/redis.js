const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
  // password: "your_redis_password" // if required
});

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
