const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	userId: String,
	userName: String,
	userEmail: String,
	orderStatus: String,
	paymentMethod: String,
	paymentStatus: String,
	PaymentId: String,
	orderDate: Date,
	payerId: String,
	instructorId: String,
	instructorName: String,
	courseImage: String,
	courseTitle: String,
	courseId: String,
	coursePricing: String,
});

module.exports = mongoose.model("Order", OrderSchema);
