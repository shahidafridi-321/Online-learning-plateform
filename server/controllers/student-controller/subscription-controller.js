const { sendVerificationEmail } = require("../../utils/email");
const Subscriber = require("../../models/Subscribers");

const subscribeUser = async (req, res) => {
	const { userEmail } = req.body;

	if (!userEmail) {
		return res.status(400).json({
			success: false,
			message: "Email is required",
		});
	}

	try {
		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(userEmail)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email format",
			});
		}

		const existingSubscriber = await Subscriber.findOne({ email: userEmail });
		if (existingSubscriber) {
			return res.status(409).json({
				success: false,
				message: "Email already subscribed",
			});
		}

		const verificationToken = Math.floor(
			100000 + Math.random() * 900000
		).toString();
		const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

		const newSubscriber = new Subscriber({
			email: userEmail,
			verificationToken,
			verificationTokenExpires,
		});

		await newSubscriber.save();

		try {
			await sendVerificationEmail(userEmail, verificationToken);
		} catch (emailError) {
			await Subscriber.deleteOne({ _id: newSubscriber._id });
			throw emailError;
		}

		res.status(201).json({
			success: true,
			message: "Verification code sent to your email",
		});
	} catch (error) {
		console.error("Subscription error:", error);
		res.status(500).json({
			success: false,
			message: error.message || "Failed to process subscription",
		});
	}
};

const verifyEmail = async (req, res) => {
	const { userEmail, verificationToken } = req.body;

	if (!userEmail || !verificationToken) {
		return res.status(400).json({
			success: false,
			message: "Email and Verification code is required",
		});
	}
	try {
		const subscriber = await Subscriber.findOne({ email: userEmail });
		if (!subscriber) {
			return res.status(404).json({
				success: false,
				message: "No Subscriber Found!",
			});
		}

		if (subscriber.isVerified) {
			return res.status(400).json({
				success: false,
				message: "User already verified",
			});
		}

		if (subscriber.verificationTokenExpires < new Date()) {
			return res.status(410).json({
				success: false,
				message: "Verification code expired",
			});
		}

		if (subscriber.verificationToken !== verificationToken) {
			return res.status(401).json({
				success: false,
				message: "Invalid verification code",
			});
		}

		subscriber.isVerified = true;
		subscriber.isActive = true;
		subscriber.verificationToken = undefined;
		subscriber.verificationTokenExpires = undefined;
		await subscriber.save();

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error during verification",
		});
	}
};

module.exports = { subscribeUser, verifyEmail };
