const express = require("express")
const router = express.Router()
const sessionControler = require("../../controllers/sessionControler")
const accessByToken = require("../../middlewares/accessByToken")

//get all session(admin's users)
router
    .route("/session")
    .post(
        accessByToken.isAdmin,
        sessionControler.getAll
    )

//update status_block
router
    .route("/session/:sessionId")
    .post(
        accessByToken.isAdmin,
        sessionControler.update
    )

//remove one session
router
    .route("/session/:sessionId")
    .delete(
        accessByToken.isAdmin,
        sessionControler.remove
    )

module.exports = router