const express = require("express");
const {
	getAllReviews,
	createReview,
} = require("../../controllers/student-controller/review-controller");

const router = express.Router();

router.post("/create/review", createReview);
router.get("/get/reviews", getAllReviews);

module.exports = router;
