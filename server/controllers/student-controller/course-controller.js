const Course = require("../../models/Course");

const getAllStudentViewCourses = async (req, res) => {
	try {
		const coursesList = await Course.find({});
		if (coursesList.length === 0) {
			res.status(404).json({
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
