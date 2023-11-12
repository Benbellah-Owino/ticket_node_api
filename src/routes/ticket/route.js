const router = require("express").Router();
const {create, return_ticket, confirm, get_ticket, get_all_event_tickets, get_my_tickets} = require("../../controllers/ticket/contr")
const {verify_user} = require("../../middleware/auth/jwt");

router.get("/get_one",verify_user, get_ticket);
router.get("/get_all", verify_user, get_all_event_tickets);
router.get("/get_my", verify_user, get_my_tickets);

router.post("/create", verify_user, create);
router.post("/return", verify_user, return_ticket)
router.post("/confirm", verify_user, confirm)


module.exports = router;