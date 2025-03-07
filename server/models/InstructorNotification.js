const mongoose = require("mongoose");
const InstructorNotificationSchema = new mongoose.Schema({
	instructorId: String,
	status: String,
	adminComment: String,
	message: String,
	courseId: String,
	courseTitle: String,
	date: Date,
	isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model(
	"instructorNotifications",
	InstructorNotificationSchema
);
