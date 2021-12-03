const redis = require("redis");
const redisClient = redis.createClient({
    host: process.env.redis_host,
    port: parseInt(process.env.redis_port),
    password: process.env.redis_pass
});

module.exports = redisClient