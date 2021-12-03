const BaseValidate = require("../core/baseValidate");

class AdminAuthValidate extends BaseValidate {
    constructor() {
        super()
    }
    paramsLogin(fields) {
        return this.checkValidation(fields, {
            roleId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
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
                type: Object,
                // required: false,
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
                service_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                }
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
            adminId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
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
                // required: false,
                use: { test: this.useRegexEmail }
            },
            phone_number: {
                type: String,
                // required: false,
                use: { test: this.useRegexMobilePhone }
            },
            service_id: {
                type: String,
                // required: false,
                use: { test: this.useRegexUUID4 }
            }
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
            email: {
                type: String,
                required: false,
                use: { test: this.useRegexEmail }
            },
            phone_number: {
                type: String,
                required: true,
                use: { test: this.useRegexMobilePhone }
            },
            service_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }
}


module.exports = new AdminAuthValidate()