const express = require("express");
const {
	getAllReviews,
	createReview,
	approveReview,
	deleteReview,
	getLatestReviews,
} = require("../../controllers/student-controller/review-controller");

const router = express.Router();

router.post("/create/review", createReview);
router.get("/get/reviews", getAllReviews);
router.get("/get/latest-reviews", getLatestReviews);
router.post("/update/review/:id", approveReview);
router.delete("/delete/review/:id", deleteReview);

module.exports = router;
