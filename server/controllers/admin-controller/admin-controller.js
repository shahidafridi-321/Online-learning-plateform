const mongoose = require("mongoose");
const Courses = require("../../models/Course");
const Users = require("../../models/User");
const Reviews = require("../../models/Reviews");

const getAllCourses = async (req, res) => {
	try {
		const courses = await Courses.find({});
		if (!courses) {
			return res.status(404).json({
				success: false,
				message: "No Course Found",
			});
		}
		res.status(200).json({
			success: true,
			message: "Fetching courses successful",
			data: courses,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error during fetching courses",
		});
	}
};
const getAllReviews = async (req, res) => {
	try {
		const reviews = await Reviews.find({});
		if (!reviews) {
			return res.status(404).json({
				success: false,
				message: "No Review Found",
			});
		}
		res.status(200).json({
			success: true,
			message: "Fetching Reviews successful",
			data: reviews,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error during fetching reviews",
		});
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await Users.find({
			$or: [{ role: "user" }, { role: "instructor" }],
		});
		if (!users) {
			return res.status(404).json({
				success: false,
				message: "No User Found",
			});
		}
		res.status(200).json({
			success: true,
			message: "Users Retrieved",
			data: users,
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "Internal server error during fetching users",
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const { role, isVerified } = req.body;

		if (!userId) {
			return res.status(400).json({
				success: false,
				message: "Invalid user ID",
			});
		}

		const user = await Users.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (role) user.role = role;
		if (typeof isVerified === "boolean") user.isVerified = isVerified;
		await user.save();

		res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: user,
		});
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error while updating user",
		});
	}
};
module.exports = { getAllCourses, getAllReviews, getAllUsers, updateUser };
