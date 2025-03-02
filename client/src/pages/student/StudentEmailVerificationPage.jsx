import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifySubscribeEmailService } from "@/services";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export const StudentEmailVerificationPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// email from location state
	const emailFromState = location.state?.email || "";

	// State for form fields and submission status
	const [formData, setFormData] = useState({
		userEmail: emailFromState,
		verificationToken: "",
	});
	const [errors, setErrors] = useState({});
	const [submissionStatus, setSubmissionStatus] = useState("idle"); // idle, submitting, success, error

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	// Form validation
	const validateForm = () => {
		const newErrors = {};
		if (!formData.userEmail) newErrors.userEmail = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.userEmail))
			newErrors.userEmail = "Email is invalid";
		if (!formData.verificationToken)
			newErrors.verificationToken = "Verification code is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setSubmissionStatus("submitting");
		try {
			const response = await verifySubscribeEmailService({
				userEmail: formData.userEmail,
				verificationToken: formData.verificationToken,
			});
			if (response.success) {
				setSubmissionStatus("success");
				setTimeout(() => navigate("/"), 3000); // Redirect to homepage in 3 seconds
			} else {
				setErrors({
					server:
						response.message || "Invalid code or email. Please try again.",
				});
				setSubmissionStatus("error");
			}
		} catch (error) {
			console.log(error);
			setErrors({ server: "An error occurred. Please try again later." });
			setSubmissionStatus("error");
		}
	};

	// Success message
	if (submissionStatus === "success") {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center py-16"
			>
				<CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
				<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Email Verified Successfully!
				</h2>
				<p className="text-gray-600 dark:text-gray-300 mt-4">
					Thank you for verifying your email. Redirecting to homepage shortly...
				</p>
			</motion.div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<Card className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-xl backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
							Verify Your Email
						</CardTitle>
						<CardDescription className="text-gray-600 dark:text-gray-300">
							Enter the code sent to your email to complete verification.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="userEmail"
									className="text-sm font-medium text-gray-700 dark:text-gray-200"
								>
									Email
								</Label>
								<Input
									id="userEmail"
									name="userEmail"
									type="email"
									value={formData.userEmail}
									onChange={handleInputChange}
									placeholder="Enter your email"
									className={`w-full px-4 py-2 rounded-md border ${
										errors.userEmail
											? "border-red-500"
											: "border-gray-300 dark:border-gray-600"
									} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
									disabled={submissionStatus === "submitting"}
								/>
								{errors.userEmail && (
									<p className="text-red-500 dark:text-red-400 text-sm">
										{errors.userEmail}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="verificationToken"
									className="text-sm font-medium text-gray-700 dark:text-gray-200"
								>
									Verification Code
								</Label>
								<Input
									id="verificationToken"
									name="verificationToken"
									type="text"
									value={formData.verificationToken}
									onChange={handleInputChange}
									placeholder="Enter the code"
									className={`w-full px-4 py-2 rounded-md border ${
										errors.verificationToken
											? "border-red-500"
											: "border-gray-300 dark:border-gray-600"
									} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
									disabled={submissionStatus === "submitting"}
								/>
								{errors.verificationToken && (
									<p className="text-red-500 dark:text-red-400 text-sm">
										{errors.verificationToken}
									</p>
								)}
							</div>
							{errors.server && (
								<p className="text-red-500 dark:text-red-400 text-sm text-center">
									{errors.server}
								</p>
							)}
							<Button
								type="submit"
								className={`w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center ${
									submissionStatus === "submitting"
										? "opacity-75 cursor-not-allowed"
										: ""
								}`}
								disabled={submissionStatus === "submitting"}
							>
								{submissionStatus === "submitting" ? (
									<>
										<Loader2 className="animate-spin mr-2 h-5 w-5" />
										Verifying...
									</>
								) : (
									"Verify Email"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};
