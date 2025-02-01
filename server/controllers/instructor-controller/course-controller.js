const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
	try {
		const courseData = req.body;
		const newlyCreatedCourse = new Course(courseData);
		const saveCourse = await newlyCreatedCourse.save();
		if (saveCourse) {
			res.status(201).json({
				success: true,
				message: "Course Added Successfully",
				data: saveCourse,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Some Error Occured",
		});
	}
};
