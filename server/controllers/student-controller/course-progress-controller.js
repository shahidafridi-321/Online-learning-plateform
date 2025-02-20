const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourse = require("../../models/StudentCourses");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Error Occured in Current course Marked as view",
		});
	}
};
// get our  current course progress
const getCurrentCourseProgress = async (req, res) => {
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Error Occured in Current course progress",
		});
	}
};

// reset course progress
const resetCurrentCourseProgress = async (req, res) => {
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Error Occured in Current course Reset",
		});
	}
};
