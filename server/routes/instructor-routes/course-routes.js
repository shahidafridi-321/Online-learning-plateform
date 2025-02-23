const express = require("express");
const {
	addNewCourse,
	getCourseDetailsById,
	updateCourseById,
	getMyCourses,
} = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get/:id", getMyCourses);
router.get("/get/detials/:id", getCourseDetailsById);
router.put("/update/:id", updateCourseById);

module.exports = router;
