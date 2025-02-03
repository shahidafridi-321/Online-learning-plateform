const express = require("express");
const {
	getAllCourses,
	addNewCourse,
	getCourseDetailsById,
	updateCourseById,
} = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("get/detials/:id", getCourseDetailsById);
router.put("/update/:id", updateCourseById);

module.exports = router;
