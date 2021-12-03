const BaseValidate = require("../core/baseValidate");

class CompanyInfoValidate extends BaseValidate {
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
                name: {
                    type: String,
                },
                economic_code: {
                    type: String,
                },
                national_code: {
                    type: String,
                },
                registeration_id: {
                    type: String,
                },
                telephone_number: {
                    type: String,
                },
                field_of_activity: {
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
            companyId: {
                type: String,
                required: true,
                // use: { test: this.useRegexUUID4 }
            }
        })
    }
    update(fields) {
        return this.checkValidation(fields, {
            name: {
                type: String,
                required: true,
            },
            economic_code: {
                type: String,
            },
            national_code: {
                type: String,
            },
            registeration_id: {
                type: String,
            },
            telephone_number: {
                type: String,
            },
            field_of_activity: {
                type: String,
            },
        })
    }
}


module.exports = new CompanyInfoValidate()