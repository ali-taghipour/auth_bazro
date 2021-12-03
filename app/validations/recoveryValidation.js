const BaseValidate = require("../core/baseValidate");

class RecoveryValidate extends BaseValidate {
    constructor() {
        super()
    }
    getAll(fields) {
        return this.checkValidation(fields, {
            filter: {
                // type: Object,
                id: {
                    type: String,
                },
                user_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                session_id: {
                    type: String,
                    required: false,
                },
                block_status: {
                    // type: String,
                    required: false,
                    enum: ["false", "true", true, false]
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
            securityQuestionId: {
                type: String,
                required: true,
            }
        })
    }

    params(fields) {
        return this.checkValidation(fields, {
            securityQuestionId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }
    createSecurityQuestion(fields) {
        return this.checkValidation(fields, {
            question: {
                type: String,
                required: true,
            }
        })
    }
    updateSecurityQuestion(fields) {
        return this.checkValidation(fields, {
            question: {
                type: String,
                required: true,
            }
        })
    }
    createSecurityAnswer(fields) {
        return this.checkValidation(fields, {
            security_question_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            answer: {
                type: String,
                required: true,
            }
        })
    }
    recoverByLastPasword(fields) {
        return this.checkValidation(fields, {
            username: {
                type: String,
                required: true,
            },
            last_password: {
                type: String,
                required: true,
            },
        })
    }
    confirmUser(fields) {
        return this.checkValidation(fields, {
            username: {
                type: String,
                required: true,
            },
            security_question_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            answer: {
                type: String,
                required: true,
            },
            new_password: {
                type: String,
                required: true,
            }
        })
    }
}


module.exports = new RecoveryValidate()