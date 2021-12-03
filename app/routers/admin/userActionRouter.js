const express = require("express")
const router = express.Router()
const userController = require("../../controllers/userController")
const accessByToken = require("../../middlewares/accessByToken")

//get all admin's users
router
    .route("/wallet/black-list")
    .get(
        accessByToken.isAdmin,
        userController.blackListUser
)
    
//get all admin's users
router
    .route("/wallet/:walletId/block")
    .post(
        accessByToken.isAdmin,
        userController.blockUserWithWalletId
    )

//get one user by wallet
router
    .route("/wallet/:walletId/unblock")
    .post(
        accessByToken.isAdmin,
        userController.unBlockUserWithWalletId
    )


module.exports = router
