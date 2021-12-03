const response = require("../helpers/responseHelper");
const serviceRepo = require("../repositories/serviceRepo");
const validate = require("../validations/serviceValidation");
const { Op } = require("sequelize");
const walletService = require("../services/walletService");

//getting all record by filter and pagination parameters (available for superAdmin)
module.exports.getAllService = async (req, res) => {
    try {
        validate.getAll(req.body)
        let filter = {}
        let tempFilter = {}
        if (req.body.filter) {
            tempFilter = typeof req.body.filter === String ? JSON.parse(req.body.filter) : req.body.filter
            if (tempFilter.id) filter["id"] = tempFilter.id
            if (tempFilter.name) filter["name"] = { [Op.like]: `%${tempFilter.name}%` }
        }

        const orderBy = req.body.sort_by ? req.body.sort_by : "id";
        const orderType = req.body.sort_type && req.body.sort_type == 1 ? "ASC" : "DESC";
        const limit = req.body.per_page ? req.body.per_page : 10;
        const offset = req.body.page ? (req.body.page > 0 ? req.body.page - 1 : 0) * limit : 0;
        const result = await serviceRepo.getAll(filter, orderBy, orderType, offset, limit)
        return response.success(res, result)

    } catch (e) {
        return response.exception(res, e);
    }
}

//getting one service by serviceId (available for superAdmin)
module.exports.getById = async (req, res) => {
    try {
        validate.params(req.params)
        const result = await serviceRepo.getById(req.params.serviceId)
        if (!result) return response.error(res, "service not founded")
        return response.success(res, result)
    } catch (e) {
        return response.exception(res, e);
    }
}

//create new service (just superAdmin can access)
module.exports.addNewService = async (req, res) => {
    try {
        validate.addNewService(req.body)
        await serviceRepo.checkServiceIsAvailble(req.body)
        const serviseResult = await serviceRepo.addNewService(req.body)
        const packetResult = await walletService.makePacketByPacketId(serviseResult)
        return response.success(res, { service: serviseResult, packet: packetResult })
    } catch (e) {
        return response.exception(res, e);
    }
}

//cupdate a service by serviceId (just superAdmin can access)
module.exports.updateService = async (req, res) => {
    try {
        validate.params(req.params)
        validate.updateService(req.body)
        const service = await serviceRepo.getById(req.params.serviceId)
        if (!service)
            return response.error(res, "service not founded")
        const result = await serviceRepo.updateService(service.id, req.body)
        return response.success(res, [])
    } catch (e) {
        return response.exception(res, e);
    }
}
