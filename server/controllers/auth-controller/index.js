const User = require("../../models/User");
const bcrypt = require("bcryptjs");

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

		return res.status(201).json({
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

module.exports = { registerUser };
