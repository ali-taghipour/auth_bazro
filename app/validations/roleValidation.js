const BaseValidate = require("../core/baseValidate");

class RoleValidate extends BaseValidate {
    constructor() {
        super()
    }

    params(fields) {
        return this.checkValidation(fields, {
            roleId: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }
    paramsAdmin(fields) {
        return this.checkValidation(fields, {
            adminId: {
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
                service_id: {
                    type: String,
                    required: false,
                    use: { test: this.useRegexUUID4 }
                },
                name: {
                    required: false,
                    type: String,
                },
                is_permission: {
                    // type: String,
                    required: false,
                    enum: ["false", "true", true, false]
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
    getOneAdminRole(fields) {
        return this.checkValidation(fields, {
            id: {
                type: String,
                required: false,
                use: { test: this.useRegexUUID4 }
            },
            name: {
                type: String,
            },
        })
    }
    addNewRole(fields) {
        return this.checkValidation(fields, {
            name: {
                type: String,
                required: true,
            },
            service_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            },
            is_permission: {
                required: false,
                // type: String,
                enum: ["false", "true", true, false]
            },
        })
    }
    addNewRoleOnlyName(fields) {
        return this.checkValidation(fields, {
            name: {
                type: String,
                required: true,
            }
        })
    }
    updateRole(fields) {
        return this.checkValidation(fields, {
            name: {
                type: String,
                required: true,
            },
            is_permission: {
                required: false,
                // type: String,
                enum: ["false", "true", true, false]
            },
        })
    }
    setRolePermissionToUser(fields) {
        return this.checkValidation(fields, {
            user_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }
    unsetRolePermissionFromUser(fields) {
        return this.checkValidation(fields, {
            user_id: {
                type: String,
                required: true,
                use: { test: this.useRegexUUID4 }
            }
        })
    }
}


module.exports = new RoleValidate()