const mongoose = require("mongoose");
const Courses = require("../../models/Course");
const InstructorNotification = require("../../models/InstructorNotification");

const approveCourse = async (req, res) => {
	try {
		const course = await Courses.findById(req.params.courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "No course found",
			});
		}
		if (course.isPublished) {
			return res.status(400).json({
				success: false,
				message: "Course already published",
			});
		}
		course.isPublished = true;
		await course.save();

		const notification = new InstructorNotification({
			instructorId: course.instructorId,
			status: "approved",
			adminComment: "All requirements met. Great job!",
			message: "Congratulations! Your course has been approved by an admin.",
			courseId: course._id,
			courseTitle: course.title,
			date: new Date(),
		});
		await notification.save();

		res.status(200).json({
			success: true,
			message: "Course approved successfully",
			data: { courseId: course._id },
		});
	} catch (error) {
		console.error("Error approving course:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error while approving course",
		});
	}
};

const rejectCourse = async (req, res) => {
	try {
		const course = await Courses.findById(req.params.courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "No course found",
			});
		}
		if (!course.isPublished) {
			return res.status(400).json({
				success: false,
				message: "Course already rejected",
			});
		}
		course.isPublished = false;
		await course.save();

		const notification = new InstructorNotification({
			instructorId: course.instructorId,
			status: "rejected",
			adminComment:
				"Requirements not fully met. Please review the guidelines and resubmit.",
			message: "Unfortunately, your course has been rejected by an admin.",
			courseId: course._id,
			courseTitle: course.title,
			date: new Date(),
		});
		await notification.save();

		res.status(200).json({
			success: true,
			message: "Course rejected successfully",
			data: { courseId: course._id },
		});
	} catch (error) {
		console.error("Error rejecting course:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error while rejecting course",
		});
	}
};

module.exports = { approveCourse, rejectCourse };
