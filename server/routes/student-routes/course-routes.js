const express = require("express");
const {
	getStudentViewCourseDetails,
} = require("../../controllers/student-controller/course-controller");

const router = express.Router();

router.get("/get", getStudentViewCourseDetails);
router.get("/get/details/:id", getStudentViewCourseDetails);
