const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
	try {
		const courseData = req.body;
		const newlyCreatedCourse = new Course(courseData);
		const saveCourse = await newlyCreatedCourse.save();
		if (saveCourse) {
			return res.status(201).json({
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

const getMyCourses = async (req, res) => {
	try {
		const { id } = req.params;
		const courses = await Course.find({ instructorId: id });
		res.status(200).json({
			success: true,
			data: courses,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Some Error Occured",
		});
	}
};

/* const getAllCourses = async (req, res) => {
	try {
		const courseList = await Course.find({});

		res.status(201).json({
			success: true,
			data: courseList,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Some Error Occured",
		});
	}
}; */

const getCourseDetailsById = async (req, res) => {
	try {
		const id = req.params.id;
		const courseDetails = await Course.findById(id);
		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: "Course Not Found",
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
			message: "Some Error Occured",
		});
	}
};

const updateCourseById = async (req, res) => {
	try {
		const id = req.params.id;
		const updatedCourseData = req.body;
		const updatedCourse = await Course.findByIdAndUpdate(
			id,
			updatedCourseData,
			{
				new: true,
			}
		);

		if (!updatedCourse) {
			return res.status(404).json({
				success: false,
				message: "Course Not Found",
			});
		}
		res.status(200).json({
			success: true,
			message: "Course Updated successfully",
			data: updatedCourse,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Some Error Occured",
		});
	}
};

module.exports = {
	addNewCourse,
	getMyCourses,
	getCourseDetailsById,
	updateCourseById,
};
