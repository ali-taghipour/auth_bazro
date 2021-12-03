const express = require("express")
const router = express.Router()
const addressController = require("../../controllers/addressController")
const accessByToken = require("../../middlewares/accessByToken")

//get admin Addresses by his/her self
router
    .route("/address/my")
    .get(
        accessByToken.isAdmin,
        addressController.getMy
    )

//set admin Address by his/her self
router
    .route("/address/my")
    .post(
        accessByToken.isAdmin,
        addressController.setMy
    )

//get all addresses(this admin's userAddresses)
router
    .route("/address")
    .post(
        accessByToken.isAdmin,
        addressController.getAll
    )
//get one address by addressId
router
    .route("/address/:addressId")
    .get(
        accessByToken.isAdmin,
        addressController.getById
    )
//update address by addressId
router
    .route("/address/:addressId")
    .post(
        accessByToken.isAdmin,
        addressController.update
    )

module.exports = router