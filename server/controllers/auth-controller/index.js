const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

		// create newUser
		const newUser = new User({
			userName,
			userEmail,
			password: hashPassword,
			role,
		});

		// save new user
		await newUser.save();

		res.status(201).json({
			success: true,
			message: "User registered successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internet server Error",
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
			message: "Invalid credintial",
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

module.exports = { registerUser, loginUser };
