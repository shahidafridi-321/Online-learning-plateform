import React, { useState, useEffect } from "react";
import { verifyEmailService } from "@/services";
import { Button } from "@/components/ui/button";
import { toast } from "react-sonner";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const EmailVerificationPage = () => {
	const [userEmail, setUserEmail] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resendMessage, setResendMessage] = useState("");
	const [isDarkMode, setIsDarkMode] = useState(false);
	const navigate = useNavigate();

	// Sync with system mode and toggle dark mode
	useEffect(() => {
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		const savedTheme = localStorage.getItem("theme");
		const initialDarkMode = savedTheme ? savedTheme === "dark" : prefersDark;

		setIsDarkMode(initialDarkMode);
		if (initialDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	const handleToggleDarkMode = () => {
		const newDarkMode = !isDarkMode;
		setIsDarkMode(newDarkMode);
		if (newDarkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

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
				toast.success("Email Verified", {
					description: "Redirecting to login page...",
				});
				setMessage("Email verified successfully! Redirecting to login page...");
				setTimeout(() => {
					navigate("/auth");
				}, 2000);
			} else {
				toast.error("Verification Failed", {
					description: response.message || "Invalid code or email.",
				});
				setMessage(response.message || "Invalid code or email.");
			}
		} catch (error) {
			console.error("Verification error:", error);
			toast.error("Verification Failed", {
				description: "An unexpected error occurred. Please try again.",
			});
			setMessage("Verification failed. Please try again.");
		}
		setIsSubmitting(false);
	};

	// Placeholder for resend functionality
	const handleResend = async () => {
		if (!userEmail) {
			toast.error("Error", {
				description: "Please enter your email first.",
			});
			return;
		}
		try {
			// await resendVerificationEmailService
			toast.info("Resend Requested", {
				description: "A new verification code has been sent to your email.",
			});
			setResendMessage("A new verification code has been sent to your email.");
		} catch (error) {
			console.error("Resend error:", error);
			toast.error("Resend Failed", {
				description:
					"Failed to resend verification code. Please try again later.",
			});
			setResendMessage(
				"Failed to resend verification code. Please try again later."
			);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 flex flex-col">
			<header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
				<Link
					to="/"
					className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
				>
					<GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
					<span className="font-bold text-2xl lg:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
						Learn For Fun
					</span>
				</Link>
				<button
					onClick={handleToggleDarkMode}
					className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
					aria-label="Toggle dark mode"
				>
					{isDarkMode ? (
						<Sun className="h-5 w-5 text-yellow-500" />
					) : (
						<Moon className="h-5 w-5 text-gray-600" />
					)}
				</button>
			</header>

			<main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 lg:py-16">
				<Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
					<CardHeader>
						<CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
							Verify Your Email
						</CardTitle>
						<p className="text-center text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
							Enter the verification code sent to your email.
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						<form onSubmit={handleVerify} className="flex flex-col gap-4">
							<Input
								type="email"
								placeholder="Enter your email"
								value={userEmail}
								onChange={(e) => setUserEmail(e.target.value)}
								required
								className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<Input
								type="text"
								placeholder="Enter verification code"
								value={verificationCode}
								onChange={(e) => setVerificationCode(e.target.value)}
								required
								className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<div className="flex flex-col gap-3">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
								>
									{isSubmitting ? "Verifying..." : "Verify Email"}
								</Button>
								<Button
									onClick={handleResend}
									disabled={isSubmitting || !userEmail}
									variant="outline"
									className="w-full text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
								>
									Resend Verification Code
								</Button>
								<Button
									onClick={() => navigate("/auth")}
									variant="secondary"
									className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
								>
									Back to Registration
								</Button>
							</div>
							{message && (
								<p className="text-center text-sm text-gray-600 dark:text-gray-400">
									{message}
								</p>
							)}
							{resendMessage && (
								<p className="text-center text-sm text-gray-600 dark:text-gray-400">
									{resendMessage}
								</p>
							)}
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};
