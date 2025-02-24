const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../../utils/email");

const registerUser = async (req, res) => {
	const { userName, userEmail, password, role } = req.body;

	// Input validation
	if (!userName || !userEmail || !password) {
		return res.status(400).json({
			success: false,
			message: "All fields are required",
		});
	}
	try {
		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ userName }, { userEmail }],
		});
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User Name or Email already exists",
			});
		}
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		// Generate a 6-digit verification code
		const verificationCode = Math.floor(
			100000 + Math.random() * 900000
		).toString();
		const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Code valid for 15 minutes

		// create newUser
		const newUser = new User({
			userName,
			userEmail,
			password: hashPassword,
			role,
			isVerified: false,
			verificationCode,
			verificationCodeExpires,
		});

		// save new user
		await newUser.save();

		// Send verification email
		await sendVerificationEmail(userEmail, verificationCode);

		res.status(201).json({
			success: true,
			message:
				"User registered successfully. Please check your email for the verification code.",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
};

const loginUser = async (req, res) => {
	const { userEmail, password } = req.body;

	// Input validation
	if (!userEmail || !password) {
		return res.status(400).json({
			success: false,
			message: "All fields are required",
		});
	}

	// Checks user exists
	const checkUser = await User.findOne({ userEmail });
	if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
		return res.status(401).json({
			success: false,
			message: "Invalid credential",
		});
	}

	// Check if email is verified
	if (!checkUser.isVerified) {
		return res.status(401).json({
			success: false,
			message:
				"Email not verified. Please check your inbox for the verification code.",
		});
	}

	const accessToken = jwt.sign(
		{
			_id: checkUser._id,
			userName: checkUser.userName,
			userEmail: checkUser.userEmail,
			role: checkUser.role,
		},
		"JWT_SECRET",
		{ expiresIn: "120m" }
	);

	res.status(200).json({
		success: true,
		message: "Logged in successfully",
		data: {
			accessToken,
			user: {
				_id: checkUser._id,
				userName: checkUser.userName,
				userEmail: checkUser.userEmail,
				role: checkUser.role,
			},
		},
	});
};

const verifyEmail = async (req, res) => {
	const { userEmail, verificationCode } = req.body;
	if (!userEmail || !verificationCode) {
		return res.status(400).json({
			success: false,
			message: "Email and Verification code is required",
		});
	}

	try {
		const user = await User.findOne({ userEmail });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		if (user.isVerified) {
			return res.status(400).json({
				success: false,
				message: "User is already verified",
			});
		}
		//check if the code has expired
		if (user.verificationCodeExpires < new Date()) {
			return res.status(400).json({
				success: false,
				message: "Verification code has expired. Please request a new one.",
			});
		}
		if (user.verificationCode !== verificationCode) {
			return res.status(400).json({
				success: false,
				message: "Invalid verification code",
			});
		}
		// Mark user as verified
		(user.isVerified = true),
			(user.verificationCode = undefined),
			(user.verificationCodeExpires = undefined);

		await user.save();

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server Error",
		});
	}
};

module.exports = { registerUser, loginUser, verifyEmail };
