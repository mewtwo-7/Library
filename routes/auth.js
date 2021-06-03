const express = require("express");
const authcontroller = require('../controllers/auth');
const router = express.Router();

router.post("/register", authcontroller.register );
router.post("/login",authcontroller.login );
router.post("/addbook",authcontroller.addbook );
router.post("/requestbook",authcontroller.requestbook);
router.post("/seerequest",authcontroller.seerequest);
router.post("/returnbook",authcontroller.returnbook);

module.exports = router;