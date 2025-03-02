const express = require("express");
const {
	subscribeUser,
	verifyEmail,
} = require("../../controllers/student-controller/subscription-controller");

const router = express.Router();

router.post("/subscribe-email", subscribeUser);
router.post("/verify-email", verifyEmail);

module.exports = router;
