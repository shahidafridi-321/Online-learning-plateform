import { GraduationCapIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CommonForm } from "@/components/ui/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
import { registerService } from "@/services";
import { ToastContainer, toast } from "react-toastify";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";

export const AuthPage = () => {
	const [activeTab, setActiveTab] = useState("signin");
	const navigate = useNavigate();

	const {
		signInFormData,
		setSignInFormData,
		signUpFormData,
		setSignUpFormData,
		handleLoginUser,
	} = useContext(AuthContext);

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

	//check only for name, email, and password
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
				toast.error("Registration Failed!");
				return;
			}
			toast.success(
				"Registration Successful. Please check your email for the verification code."
			);
			// clear the registration form
			setSignUpFormData({
				userName: "",
				userEmail: "",
				password: "",
			});
			// redirect the user to  verification page
			navigate("/verify-email");
		} catch (error) {
			console.error("Registration Error:", error);
			toast.error(
				`Registration Failed! ${error.response?.data?.message || error.message}`
			);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-gray-800">
			<header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-300 bg-white/50 backdrop-blur-sm">
				<ToastContainer />
				<Link
					to="/"
					className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
				>
					<GraduationCapIcon className="h-8 w-8 text-gray-800 animate-bounce" />
					<span className="font-bold text-2xl lg:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
						Learn For Fun
					</span>
				</Link>
			</header>

			<main className="flex items-center justify-center px-4 sm:px-8 lg:px-0 py-8 md:py-16 lg:py-24 min-h-[calc(100vh-64px)]">
				<Tabs
					value={activeTab}
					defaultValue="signin"
					onValueChange={handleTabChange}
					className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
				>
					<TabsList className="grid w-full grid-cols-2 rounded-lg bg-gray-100/50 backdrop-blur-sm p-1.5 gap-1.5 mb-6">
						<TabsTrigger
							value="signin"
							className={`w-full rounded-md py-2.5 text-sm md:text-base font-medium transition-all ${
								activeTab === "signin"
									? "bg-white shadow-md text-purple-600"
									: "text-gray-600 hover:bg-white/50"
							}`}
						>
							Sign In
						</TabsTrigger>
						<TabsTrigger
							value="signup"
							className={`w-full rounded-md py-2.5 text-sm md:text-base font-medium transition-all ${
								activeTab === "signup"
									? "bg-white shadow-md text-purple-600"
									: "text-gray-600 hover:bg-white/50"
							}`}
						>
							Sign Up
						</TabsTrigger>
					</TabsList>

					<TabsContent value="signin">
						<Card className="p-4 sm:p-6 space-y-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl text-gray-800 animate-slide-up">
							<CardHeader>
								<CardTitle className="text-lg md:text-xl font-bold">
									Sign In To Your Account
								</CardTitle>
								<CardDescription className="text-sm md:text-base text-gray-600">
									Enter your email and password to log in
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
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
						<Card className="p-4 sm:p-6 space-y-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl text-gray-800 animate-slide-up">
							<CardHeader>
								<CardTitle className="text-lg md:text-xl font-bold">
									Sign Up To Get Started
								</CardTitle>
								<CardDescription className="text-sm md:text-base text-gray-600">
									Enter your details to create your account
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
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
