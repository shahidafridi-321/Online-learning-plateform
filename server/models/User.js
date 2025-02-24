// models/User.js
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	userName: String,
	userEmail: String,
	password: String,
	role: String,
	isVerified: { type: Boolean, default: false },
	verificationCode: String,
	verificationCodeExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
