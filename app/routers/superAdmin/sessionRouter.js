const express = require("express")
const router = express.Router()
const sessionControler = require("../../controllers/sessionControler")
const accessByToken = require("../../middlewares/accessByToken")

//get all session(all users)
router
    .route("/session")
    .post(
        accessByToken.isSuperAdmin,
        sessionControler.getAll
    )

//update status_block
router
    .route("/session/:sessionId")
    .post(
        accessByToken.isSuperAdmin,
        sessionControler.update
    )

//remove one session
router
    .route("/session/:sessionId")
    .delete(
        accessByToken.isSuperAdmin,
        sessionControler.remove
    )

module.exports = router