const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		trim: true,
		lowercase: true,
		validate: {
			validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
			message: "Invalid email format",
		},
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: String,
	verificationTokenExpires: Date,
	subscribedAt: {
		type: Date,
		default: Date.now,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	unsubscribeToken: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString(),
	},
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
