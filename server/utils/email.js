const nodemailer = require("nodemailer");

const sendVerificationEmail = async (userEmail, verificationCode) => {
	// Create a transporter using environment variables
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: process.env.EMAIL_SECURE === "true",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: userEmail,
		subject: "Email Verification",
		text: `Your verification code is: ${verificationCode}`,
		html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
	};

	await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
