const mongoose = require("mongoose");

const Reviews = mongoose.Schema({
	userName: String,
	image: String,
	role: String,
	quote: String,
	date: Date,
});

module.exports = mongoose.model("review", Reviews);
