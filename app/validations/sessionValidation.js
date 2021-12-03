const BaseValidate = require("../core/baseValidate");

class SessionValidate extends BaseValidate {
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
            sessionId: {
                type: String,
                required: true,
            }
        })
    }
    update(fields) {
        return this.checkValidation(fields, {
            block_status: {
                // type: String,
                required: true,
                enum: ["false", "true", true, false]
            }
        })
    }
}


module.exports = new SessionValidate()