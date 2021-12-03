require('dotenv').config()
const log = require('./app/helpers/logHelper');
const cron = require('node-cron');
const redisClient = require("./app/database/redisDb");
const otpService = require('./app/services/otpService');
const globalSuperAdminToken = require("./app/services/globalSuperAdminToken")

redisClient.on('connect', function () {
  console.log('redis Connected!');
});



const passwordHash = require('password-hash');
const superAdminRepo = require('./app/repositories/superAdminRepo');
cron.schedule('*/1 * * * *', async () => {//every minute
  log.info('------ per 1 min -------');
  await otpService.expiringOTP()
  await otpService.deletingOldOTP()

})

cron.schedule('0 */1 * * *', async () => { //every hour
  log.info('------ per 1 hour -------');

  console.log("per 1 hour generating Token----------")
  await globalSuperAdminToken.makeNew()
  console.log("per 1 hour generating Token ended----")
})

const port = process.env.PORT || 3009
require("./app").listen(port, () => {
  log.info(`Server running on port: ${port}`)
})
