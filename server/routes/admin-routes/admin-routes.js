const express = require("express");
const {
	getAllCourses,
	getAllReviews,
	getAllUsers,
	updateUser
} = require("../../controllers/admin-controller/admin-controller");

const router = express.Router();

router.get("/courses/all", getAllCourses);
router.get("/reviews/all", getAllReviews);
router.get("/users/all", getAllUsers);
router.put("/users/:userId", updateUser);

module.exports = router;
