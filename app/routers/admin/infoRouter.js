const express = require("express")
const router = express.Router()
const infoController = require("../../controllers/infoController")
const accessByToken = require("../../middlewares/accessByToken")

//get admin info by his/her self
router
    .route("/info/my")
    .get(
        accessByToken.isAdmin,
        infoController.getMy
    )

//set admin info by his/her self
router
    .route("/info/my")
    .post(
        accessByToken.isAdmin,
        infoController.setMy
    )


//get all info(all admins,users)
router
    .route("/info")
    .post(
        accessByToken.isAdmin,
        infoController.getAll
    )


//get one info by infoId
router
    .route("/info/:infoId")
    .get(
        accessByToken.isAdmin,
        infoController.getById
    )

//update info by infoId
router
    .route("/info/:infoId")
    .post(
        accessByToken.isAdmin,
        infoController.update
    )

module.exports = router