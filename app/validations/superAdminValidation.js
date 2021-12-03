const BaseValidate = require("../core/baseValidate");

class SuperAdminValidate extends BaseValidate {
    constructor() {
        super()
    }

    loginByUserAndPass(fields) {
        return this.checkValidation(fields, {
            username: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            }
        })
    }
    requestLoginByPhoneNumber(fields) {
        return this.checkValidation(fields, {
            phone_number: {
                type: String,
                required: true,
                use: { test: this.useRegexMobilePhone },
            },
        })
    }
    verifyLoginByPhoneNumber(fields) {
        return this.checkValidation(fields, {
            phone_number: {
                type: String,
                required: true,
                use: { test: this.useRegexMobilePhone },
            },
            code: {
                type: String,
                required: true,
            }
        })
    }

    update(fields) {
        return this.checkValidation(fields, {
            username: {
                type: String,
            },
            password: {
                type: String,
            },
            email: {
                type: String,
                required: false,
                use: { test: this.useRegexEmail }
            },
            phone_number: {
                type: String,
                required: false,
                use: { test: this.useRegexMobilePhone }
            },
        })
    }


    updatePhoneNumber(fields) {
        return this.checkValidation(fields, {
            phone_number: {
                type: String,
                required: true,
                use: { test: this.useRegexMobilePhone }
            }
        })
    }
    updateEmail(fields) {
        return this.checkValidation(fields, {
            email: {
                type: String,
                required: true,
                use: { test: this.useRegexEmail }
            }
        })
    }

}


module.exports = new SuperAdminValidate()