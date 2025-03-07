const express = require("express");
const {
	approveCourse,
	rejectCourse,
} = require("../../controllers/admin-controller/admin-course-controller");

const router = express.Router();
router.post("/approve-course/:courseId", approveCourse);
router.post("/reject-course/:courseId", rejectCourse);

module.exports = router;
