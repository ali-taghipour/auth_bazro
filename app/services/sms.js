const Exception = require("../helpers/errorHelper");
const MelipayamakApi = require("melipayamak")

//sending sms for (user,admin or superAdmin) in otp login
module.exports.sendCodeSms = async (phone_number, code) => {
    const api = new MelipayamakApi(process.env.SMS_USERNAME, process.env.SMS_PASSWORD);
    const sms = api.sms();
    const to = phone_number;
    const from = process.env.SMS_NUMBER;
    const text = `${code}کد امنیتی شما `;
    try {
        await sms.send(to, from, text)
        return phone_number
    } catch (e) {
        //TODO
        return Exception.setError(e, true);
    }
}