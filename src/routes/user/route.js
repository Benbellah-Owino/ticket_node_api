const router = require("express").Router();
const {register, login} = require("../../controllers/user/contr")
const {verify_user}= require("../../middleware/auth/jwt")

router.post("/register", register);
router.post("/login", login);
module.exports = router;