const router = require("express").Router();
const {create, cancel} = require("../../controllers/event/contr");
const {verify_user} = require("../../middleware/auth/jwt");

router.post("/create",verify_user, create );
router.patch("/cancel",verify_user, cancel)
module.exports = router;