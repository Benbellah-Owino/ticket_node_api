const router = require("express").Router();
const {create, return_ticket, confirm} = require("../../controllers/ticket/contr")
const {verify_user} = require("../../middleware/auth/jwt");


router.post("/create", verify_user, create);
router.post("/return", verify_user, return_ticket)
router.post("/return", verify_user, confirm)

module.exports = router;