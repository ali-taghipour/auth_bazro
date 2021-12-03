const BaseValidate = require("../core/baseValidate");

class SocialMediaValidate extends BaseValidate {
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
                userable_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                userable_type: {
                    type: String,
                    required: false,
                    enum: ["user", "admin", "super_admin"]
                },
                facebook: {
                    type: String,
                },
                twitter: {
                    type: String,
                },
                linkedIn: {
                    type: String,
                },
                youtube: {
                    type: String,
                },
                aparat: {
                    type: String,
                },
                instagram: {
                    type: String,
                },
                telegram: {
                    type: String,
                },
                others: {
                    type: Object,
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
            socialMediaId: {
                type: String,
                required: true,
                // use: { test: this.useRegexUUID4 }
            }
        })
    }
    update(fields) {
        return this.checkValidation(fields, {
            facebook: {
                type: String,
            },
            twitter: {
                type: String,
            },
            linkedIn: {
                type: String,
            },
            youtube: {
                type: String,
            },
            aparat: {
                type: String,
            },
            instagram: {
                type: String,
            },
            telegram: {
                type: String,
            },
            others: {
                type: Object,
            }
        })
    }
}


module.exports = new SocialMediaValidate()