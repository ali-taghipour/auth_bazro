const redisClient = require("./redisDb");
const session = require("express-session");
let RedisStore = require("connect-redis")(session)

const redisStore = new RedisStore({
    host: process.env.redis_host,
    port: parseInt(process.env.redis_port),
    password: process.env.redis_pass,
    client: redisClient,
    ttl: 260
})

module.exports = redisStore