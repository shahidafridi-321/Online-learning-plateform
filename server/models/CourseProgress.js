const mongoose = require("mongoose");

const CourseProgressSchema = new mongoose.Schema({
	userId: String,
	courseId: String,
	completed: Boolean,
	completionDate: Date,
	lectureProgress: [LectureProgressSchema],
});
