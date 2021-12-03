const bcrypt = require("bcrypt");
const Exception = require("./errorHelper");
const saltRounds = process.env.BCRYPT_SALTROUNDS || 10;

//make hash from password (bcrypt)
module.exports.passwordHasher = async (pass) => {
    const hash = await bcrypt.hash(pass, saltRounds)
    return hash
}

//matching pass and hashedPass and make exception in mismatch situation
module.exports.checkPassword = async (pass, hash) => {
    const result = await bcrypt.compare(pass, hash)
    if (result === true) {
        return result
    } else {
        return Exception.setError("username or password was incorrected!")
    }
}

//matching pass and hashedPass and returning result as a Boolean
module.exports.checkPasswordBoolean = async (pass, hash) => {
    const result = await bcrypt.compare(pass, hash)
    if (result === true) {
        return true
    } else {
        return false
    }
}