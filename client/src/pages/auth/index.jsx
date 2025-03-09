import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CommonForm } from "@/components/ui/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
import { registerService } from "@/services";
import { toast } from "react-sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, Sun, Moon } from "lucide-react";

export const AuthPage = () => {
	const [activeTab, setActiveTab] = useState("signin");
	const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
	const navigate = useNavigate();

	const {
		signInFormData,
		setSignInFormData,
		signUpFormData,
		setSignUpFormData,
		handleLoginUser,
	} = useContext(AuthContext);

	// Sync with system mode and toggle dark mode
	useEffect(() => {
		// Check system preference on mount
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

	const handleTabChange = (value) => {
		setActiveTab(value);
	};

	const checkIfSignInFormIsvalid = () => {
		return (
			signInFormData &&
			signInFormData.userEmail !== "" &&
			signInFormData.password !== ""
		);
	};

	const checkIfSignUpFormIsvalid = () => {
		return (
			signUpFormData &&
			signUpFormData.userName !== "" &&
			signUpFormData.userEmail !== "" &&
			signUpFormData.password !== ""
		);
	};

	const handleRegisterUser = async (e) => {
		e.preventDefault();
		try {
			const { userName, userEmail, password } = signUpFormData;
			const regResponse = await registerService({
				userName,
				userEmail,
				password,
			});
			if (!regResponse || !regResponse.success) {
				toast.error("Registration Failed", {
					description: regResponse?.message || "An error occurred.",
				});
				return;
			}
			toast.success("Registration Successful", {
				description: "Please check your email for the verification code.",
			});
			setSignUpFormData({
				userName: "",
				userEmail: "",
				password: "",
			});
			navigate("/verify-email");
		} catch (error) {
			console.error("Registration Error:", error);
			toast.error("Registration Failed", {
				description:
					error.response?.data?.message ||
					error.message ||
					"An unexpected error occurred.",
			});
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
				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full max-w-md lg:max-w-lg mx-auto"
				>
					<TabsList className="grid w-full grid-cols-2 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-1 mb-6 shadow-md">
						<TabsTrigger
							value="signin"
							className={`rounded-lg py-2.5 text-sm md:text-base font-semibold transition-all ${
								activeTab === "signin"
									? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
									: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
							}`}
						>
							Sign In
						</TabsTrigger>
						<TabsTrigger
							value="signup"
							className={`rounded-lg py-2.5 text-sm md:text-base font-semibold transition-all ${
								activeTab === "signup"
									? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
									: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
							}`}
						>
							Sign Up
						</TabsTrigger>
					</TabsList>

					<TabsContent value="signin">
						<Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
							<CardHeader>
								<CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
									Sign In
								</CardTitle>
								<CardDescription className="text-sm md:text-base text-gray-600 dark:text-gray-400">
									Enter your email and password to access your account.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<CommonForm
									formControls={signInFormControls}
									buttonText="Sign In"
									formData={signInFormData}
									setFormData={setSignInFormData}
									isButtonDisabled={!checkIfSignInFormIsvalid()}
									handleSubmit={handleLoginUser}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="signup">
						<Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
							<CardHeader>
								<CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
									Sign Up
								</CardTitle>
								<CardDescription className="text-sm md:text-base text-gray-600 dark:text-gray-400">
									Create an account to start your learning journey.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<CommonForm
									formControls={signUpFormControls}
									buttonText="Sign Up"
									formData={signUpFormData}
									setFormData={setSignUpFormData}
									isButtonDisabled={!checkIfSignUpFormIsvalid()}
									handleSubmit={handleRegisterUser}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};
