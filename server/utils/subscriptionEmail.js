const sendVerificationEmailSubscription = async (
	userEmail,
	verificationCode
) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: Number(process.env.EMAIL_PORT),
			secure: process.env.EMAIL_SECURE === "true",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: `"Course Notifications" <${process.env.EMAIL_FROM}>`,
			to: userEmail,
			subject: "Verify Your Course Notification Subscription",
			text: `Your verification code is: ${verificationCode}\n\nThis code expires in 15 minutes.`,
			html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>
             <p>This code expires in 15 minutes.</p>`,
		};

		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error("Email sending failed:", error);
		throw new Error("Failed to send verification email");
	}
};

module.exports = { sendVerificationEmailSubscription };
