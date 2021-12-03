const BaseValidate = require("../core/baseValidate");

class AddressValidate extends BaseValidate {
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
                stat: {
                    type: String,
                },
                city: {
                    type: String,
                },
                neighborhood: {
                    type: String,
                },
                street: {
                    type: String,
                },
                alley: {
                    type: String,
                },
                house_number: {
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
            addressId: {
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
            stat: {
                type: String,
                required: false,
            },
            city: {
                type: String,
                required: false,
            },
            neighborhood: {
                type: String,
                required: false,
            },
            street: {
                type: String,
                required: false,
            },
            alley: {
                type: String,
                required: false,
            },
            house_number: {
                type: String,
                required: false,
            },
            others: {
                type: Object,
                required: false,
            }
        })
    }
}


module.exports = new AddressValidate()