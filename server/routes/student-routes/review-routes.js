const express = require("express");
const {
	getAllReviews,
	createReview,
	approveReview,
} = require("../../controllers/student-controller/review-controller");

const router = express.Router();

router.post("/create/review", createReview);
router.get("/get/reviews", getAllReviews);
router.post("/update/review/:id", approveReview);

module.exports = router;
