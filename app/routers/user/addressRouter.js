const express = require("express")
const router = express.Router()
const addressController = require("../../controllers/addressController")
const accessByToken = require("../../middlewares/accessByToken")

//get user Addresses by his/her self
router
    .route("/address")
    .get(
        accessByToken.isUser,
        addressController.getMy
    )

//set user Address by his/her self
router
    .route("/address")
    .post(
        accessByToken.isUser,
        addressController.setMy
    )

//update address by addressId
router
    .route("/address/:addressId")
    .post(
        accessByToken.isUser,
        addressController.update
    )

module.exports = router