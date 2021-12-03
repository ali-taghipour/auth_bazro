const BaseValidate = require("../core/baseValidate");

class ServiceValidate extends BaseValidate {
    constructor() {
        super()
    }

    params(fields) {
        return this.checkValidation(fields, {
            serviceId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }
    getAll(fields) {
        return this.checkValidation(fields, {
            filter: {
                id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                name: {
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
    addNewService(fields) {
        return this.checkValidation(fields, {
            name: {
                type: String,
                required: true,
            }
        })
    }
    updateService(fields) {
        return this.checkValidation(fields, {
            name: {
                type: String,
                required: true,
            }
        })
    }
}


module.exports = new ServiceValidate()