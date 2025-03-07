const mongoose = require("mongoose");
const InstructorNotification = require("../../models/InstructorNotification");

const getAllCourseNotifications = async (req, res) => {
	try {
		const notifications = await InstructorNotification.find({
			instructorId: req.params.instructorId,
		}).sort({ date: -1 });
		if (notifications.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No notifications found for this instructor",
			});
		}
		res.status(200).json({
			success: true,
			message: "Notifications retrieved successfully",
			data: notifications,
		});
	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error while fetching notifications",
		});
	}
};

const markNotificationAsRead = async (req, res) => {
	try {
		const notification = await InstructorNotification.findById(
			req.params.notificationId
		);
		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}
		notification.isRead = true;
		await notification.save();
		res.status(200).json({
			success: true,
			message: "Notification marked as read",
		});
	} catch (error) {
		console.error("Error marking notification as read:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const deleteNotification = async (req, res) => {
	try {
		if (!req.params.notificationId) {
			return res.status(400).json({
				success: false,
				message: "Invalid notification ID",
			});
		}
		const notification = await InstructorNotification.findByIdAndDelete(
			req.params.notificationId
		);
		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}
		res.status(200).json({
			success: true,
			message: "Notification deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting notification:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

module.exports = {
	getAllCourseNotifications,
	markNotificationAsRead,
	deleteNotification,
};
