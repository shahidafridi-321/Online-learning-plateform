const express = require("express");
const {
	getAllCourses,
	getAllReviews,
	getAllUsers,
} = require("../../controllers/admin-controller/admin-controller");

const router = express.Router();

router.get("/courses/all", getAllCourses);
router.get("/reviews/all", getAllReviews);
router.get("/users/all", getAllUsers);

module.exports = router;
