const BaseValidate = require("../core/baseValidate");

class InfoValidate extends BaseValidate {
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
                email: {
                    type: String,
                },
                phone_number: {
                    type: String,
                },
                configurations: {
                    type: Object,
                },
                name: {
                    type: String,
                },
                family_name: {
                    type: String,
                },
                birthday: {
                    type: String, //Date
                },
                national_id: {
                    type: String,
                },
                gender: {
                    type: String,
                },
                job: {
                    type: String,
                },
                state: {
                    type: String,
                },
                city: {
                    type: String,
                },
                others: {
                    type: Object,
                    required: false,
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
            infoId: {
                type: String,
                required: true,
            }
        })
    }
    update(fields) {
        return this.checkValidation(fields, {
            email: {
                type: String,
                required: false,
                use: { test: this.useRegexEmail }
            },
            phone_number: {
                type: String,
                // use: { test: this.useRegexMobilePhone }
            },
            configurations: {
                type: Object,
                required: false,
            },
            name: {
                type: String,
            },
            family_name: {
                type: String,
            },
            birthday: {
                type: String, //Date
            },
            national_id: {
                type: String,
            },
            gender: {
                type: String,
            },
            job: {
                type: String,
            },
            state: {
                type: String,
            },
            city: {
                type: String,
            },
            others: {
                type: Object,
                required: false,
            }
        })
    }
}


module.exports = new InfoValidate()