const router = require("express").Router();
const {register, login} = require("../../controllers/user/contr")


router.post("/register", register);
router.post("/login", login);
module.exports = router;