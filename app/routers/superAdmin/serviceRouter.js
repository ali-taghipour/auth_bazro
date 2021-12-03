const express = require("express")
const router = express.Router()
const serviceController = require("../../controllers/serviceController")
const accessByToken = require("../../middlewares/accessByToken")

//get all session
router
    .route("/service")
    .post(
        accessByToken.isSuperAdmin,
        serviceController.getAllService
    )

//create new session
router
    .route("/service/new")
    .post(
        accessByToken.isSuperAdmin,
        serviceController.addNewService
    )

//get one session
router
    .route("/service/:serviceId")
    .get(
        accessByToken.isSuperAdmin,
        serviceController.getById
    )

//update one session
router
    .route("/service/:serviceId")
    .post(
        accessByToken.isSuperAdmin,
        serviceController.updateService
    )

module.exports = router