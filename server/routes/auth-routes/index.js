const express = require("express");
const {
	registerUser,
	loginUser,
	verifyEmail,
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);

router.get("/check-auth", authenticateMiddleware, (req, res) => {
	const user = req.user;
	return res.status(201).json({
		success: true,
		message: "User is Authenticated",
		data: { user },
	});
});
module.exports = router;
