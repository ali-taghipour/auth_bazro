const { Op } = require("sequelize");
const moment = require("moment");
const otpRepo = require("../repositories/otpRepo");
const response = require("../helpers/responseHelper");
const Exception = require("../helpers/errorHelper");
const { sendCodeSms } = require("./sms");
const tokenService = require("./tokenService");
const adminRepo = require("../repositories/adminRepo");

//making randomly code
const generateCode = () => {
    const minm = 100000;
    const maxm = 999999;
    const random = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    return random;
}
//getting number of try in last 2 hours
const numberOfSendedCodes = async (mobile_phone) => {
    return await otpRepo.count({
        phone_number: mobile_phone,
        send_at: {
            [Op.gte]: moment().subtract(2, "hours").toDate()
        }
    });
}

//make and send random code to the phone for verification
module.exports.sendOtpByPhone = async (mobile, userId, userType) => {
    const codeCount = await numberOfSendedCodes(mobile); //getting number of try in last 2 hours

    if (codeCount >= 5) {
        return null;
    }
    const code = generateCode();//making randomly code
    await otpRepo.storeNewCode(mobile, code, userId, userType); //add new record in otpModel(database)

    const nubmer = await sendCodeSms(mobile, code);
    if (nubmer == mobile) { //if sending was successfully
        await otpRepo.changeStatusToSended(mobile, code);//change otpModel record status to sended
    }
    return mobile;
}
//verifing code and sended code in database in otp login
module.exports.verifyOtpByPhone = async (mobile, code) => {
    const otp = await otpRepo.getByPhoneAndCode(mobile, code);

    if (!otp)
        return Exception.setError("code was expired")
    if (!(otp.status == "sended" || otp.status == "sending"))
        return Exception.setError("code was expired !!")

    await otpRepo.changeStatusToDone(otp.id);//change otpModel record status to sended

    return otp
}
//change otp record status to expired (this servise running on cron every minute) 
module.exports.expiringOTP = async () => {
    const timeForExpiring = moment().subtract(5, "minutes").toDate()
    return await otpRepo.changeStatusToExpire(timeForExpiring)
}
//remove old otp record (this servise running on cron every minute) 
module.exports.deletingOldOTP = async () => {
    const timeForExpiring = moment().subtract(3, "hours").toDate()
    return await otpRepo.deleteOlderThan(timeForExpiring)
}