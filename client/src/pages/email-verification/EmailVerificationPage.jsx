import React, { useState } from "react";
import { verifyEmailService } from "@/services";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const EmailVerificationPage = () => {
	const [userEmail, setUserEmail] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resendMessage, setResendMessage] = useState("");
	const navigate = useNavigate();

	const handleVerify = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setMessage("");
		try {
			const response = await verifyEmailService({
				userEmail,
				verificationCode,
			});
			if (response.success) {
				toast.success("Email verified successfully!");
				setMessage("Email verified successfully! Redirecting to login page...");
				// Redirect after a short delay
				setTimeout(() => {
					navigate("/auth");
				}, 2000);
			} else {
				toast.error(response.message);
				setMessage(response.message);
			}
		} catch (error) {
			console.error("Verification error:", error);
			toast.error("Verification failed. Please try again.");
			setMessage("Verification failed. Please try again.");
		}
		setIsSubmitting(false);
	};

	/* // Optional: implement resend verification code functionality if available.
	const handleResend = async () => {
		try {
			// Uncomment and use your resend service if available:
			// await resendVerificationEmailService({ userEmail });
			toast.info("A new verification code has been sent to your email.");
			setResendMessage("A new verification code has been sent to your email.");
		} catch (error) {
			console.error("Resend error:", error);
			toast.error(
				"Failed to resend verification code. Please try again later."
			);
			setResendMessage(
				"Failed to resend verification code. Please try again later."
			);
		}
	}; */

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-gray-800 items-center justify-center">
			<ToastContainer />
			<div className="max-w-md w-full p-6 bg-white rounded shadow">
				<h2 className="text-xl font-bold mb-4 text-center">
					Verify Your Email
				</h2>
				<p className="text-center mb-4 text-sm text-gray-600">
					Please check your inbox for the verification code and enter it below.
				</p>
				<form onSubmit={handleVerify} className="flex flex-col gap-4">
					<input
						type="email"
						placeholder="Enter your email"
						value={userEmail}
						onChange={(e) => setUserEmail(e.target.value)}
						required
						className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>
					<input
						type="text"
						placeholder="Enter verification code"
						value={verificationCode}
						onChange={(e) => setVerificationCode(e.target.value)}
						required
						className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>
					<div className="flex flex-col gap-3">
						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Verifying..." : "Verify Email"}
						</Button>
						<Button
							disabled={isSubmitting || !userEmail}
							variant="outline"
							className="w-full"
						>
							Resend Verification Code
						</Button>
						<Button
							onClick={() => navigate("/auth")}
							variant="secondary"
							className="w-full"
						>
							Back To Registration
						</Button>
					</div>
					{message && <p className="text-center mt-2 text-sm">{message}</p>}
					{resendMessage && (
						<p className="text-center mt-2 text-sm">{resendMessage}</p>
					)}
				</form>
			</div>
		</div>
	);
};
