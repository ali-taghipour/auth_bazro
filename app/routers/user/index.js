const express = require("express")
const router = express.Router()

router.use(require("../../middlewares/checkingUserBlockStatus"));
router.use(require("./authRouter"));
router.use(require("./addressRouter"));
router.use(require("./infoRouter"));
router.use(require("./companyRouter"));
router.use(require("./socialMediaRouter"));
router.use(require("./sessionRouter"));
router.use(require("./recoveryRouter"));

module.exports = router