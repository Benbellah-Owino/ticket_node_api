const router = require("express").Router();
const {create, cancel, get_all} = require("../../controllers/event/contr");
const {verify_user} = require("../../middleware/auth/jwt");

router.post("/create",verify_user, create );
router.patch("/cancel",verify_user, cancel);
router.get("/get_all", get_all)
module.exports = router;