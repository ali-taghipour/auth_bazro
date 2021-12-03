const _ = require("lodash");
const log = require("./logHelper");

class ValidationException extends Error {
    constructor(error, data, isThrow) {
        super(error);
        this.extensions = error;
        this.isThrow = isThrow;
        this.data = data;
    }
}
module.exports.ValidationException = ValidationException;

