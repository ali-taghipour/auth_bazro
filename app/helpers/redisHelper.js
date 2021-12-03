// const redis = require("redis");
// const redisClient = redis.createClient({
//   host: process.env.redis_host,
//   port: parseInt(process.env.redis_port),
//   password: process.env.redis_pass
// });

// module.exports = redisClient

// module.exports = class Redis {
//   constructor() {
//     this.result = {status: false}
//   }
//
//   async add(user_id, token)
//   {
//     redisClient.setex(user_id, process.env.redisEndTime, JSON.stringify(token))
//   }
//
//   async get(user_id)
//   {
//     await redisClient.get(user_id, (err, user_data) =>
//     {
//       console.log(err)
//       console.log(user_data)
//       if (err) this.result = {
//         status: false
//       }
//       if (user_data !== null)
//       {
//         console.log("im not null")
//         this.result = {
//           status: true,
//           data: JSON.parse(user_data)
//         }
//       } else {
//         console.log("im null")
//         this.result = {
//           status: false
//         }
//       }
//     })
//
//     return this.result
//   }
//
//   async update()
//   {
//
//   }
//
// }

// module.exports = new Redis()