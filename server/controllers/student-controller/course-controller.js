const Course = require("../../models/Course");

const getAllStudentViewCourses = async (req, res) => {
	try {
		const coursesList = await Course.find({});
		if (coursesList.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No Course Found",
				data: [],
			});
		}

		res.status(200).json({
			success: true,
			data: coursesList,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong,fetching courses error",
		});
	}
};

const getStudentViewCourseDetails = async (req, res) => {
	try {
		const id = req.params.id;
		const courseDetails = await Course.findById(id);
		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: "Course Not Found",
				data: null,
			});
		}

		res.status(200).json({
			success: true,
			data: courseDetails,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong,fetching course details error",
		});
	}
};

module.exports = {
	getAllStudentViewCourses,
	getStudentViewCourseDetails,
};
