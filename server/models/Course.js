const mongoose = require("mongoose");

const LectureSchema = mongoose.Schema({
	title: { type: String, required: true },
	type: { type: String, enum: ["video", "text"], default: "video" },
	videoUrl: { type: String, default: "" },
	public_id: { type: String, default: "" },
	textContent: { type: String, default: "" },
	freePreview: { type: Boolean, default: false },
});

const courseSchema = mongoose.Schema({
	instructorId: String,
	instructorName: String,
	date: Date,
	title: String,
	category: String,
	level: String,
	primaryLanguage: String,
	subtitle: String,
	description: String,
	image: String,
	welcomeMessage: String,
	pricing: Number,
	objectives: String,
	students: [
		{
			studentId: String,
			studentName: String,
			studentEmail: String,
		},
	],
	curriculum: [LectureSchema],
	isPublished: Boolean,
});

module.exports = mongoose.model("Course", courseSchema);
