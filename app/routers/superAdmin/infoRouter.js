const express = require("express")
const router = express.Router()
const infoController = require("../../controllers/infoController")
const accessByToken = require("../../middlewares/accessByToken")

//get superAdmin info by his/her self
router
    .route("/info/my")
    .get(
        accessByToken.isSuperAdmin,
        infoController.getMy
    )

//set superAdmin info by his/her self
router
    .route("/info/my")
    .post(
        accessByToken.isSuperAdmin,
        infoController.setMy
    )

//get all info(all admins,users)
router
    .route("/info")
    .post(
        accessByToken.isSuperAdmin,
        infoController.getAll
    )


//get one info by infoId
router
    .route("/info/:infoId")
    .get(
        accessByToken.isSuperAdmin,
        infoController.getById
    )

//update info by infoId
router
    .route("/info/:infoId")
    .post(
        accessByToken.isSuperAdmin,
        infoController.update
    )

module.exports = router