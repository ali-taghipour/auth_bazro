const BaseValidate = require("../core/baseValidate");

class UserAuthValidate extends BaseValidate {
    constructor() {
        super()
    }
    paramsLogin(fields) {
        return this.checkValidation(fields, {
            roleId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            serviceId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
        })
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
    getAll(fields) {
        return this.checkValidation(fields, {
            filter: {
                // type: Object,
                id: {
                    type: String,
                },
                username: {
                    type: String,
                },
                email: {
                    type: String,
                },
                phone_number: {
                    type: String,
                },
            },
            sort_by: {
                type: String,
            },
            sort_type: {
                type: String,
                required: false,
                enum: [1, -1],
            },
            per_page: {
                type: String,
            },
            page: {
                type: String,
            },
        })
    }
    params(fields) {
        return this.checkValidation(fields, {
            userId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
        })
    }
    getByWalletId(fields) {
        return this.checkValidation(fields, {
            walletId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
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
    register(fields) {
        return this.checkValidation(fields, {
            username: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            phone_number: {
                type: String,
                required: true,
                use: { test: this.useRegexMobilePhone }
            },
        })
    }
    removeUser(fields) {
        return this.checkValidation(fields, {
            password: {
                type: String,
                required: true,
            },
        })
    }
}


module.exports = new UserAuthValidate()