const mongoose = require("mongoose");

const ReviewsSchema = mongoose.Schema({
	userName: String,
	image: String,
	role: String,
	quote: String,
	date: Date,
	approved: Boolean,
});

module.exports = mongoose.model("review", ReviewsSchema);
