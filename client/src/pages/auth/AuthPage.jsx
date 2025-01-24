import { GraduationCapIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CommonForm } from "@/components/ui/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
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

	const {
		signInFormData,
		setSignInFormData,
		signUpFormData,
		setSignUpFormData,
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

	const checkIfSignUpFormIsvalid = () => {
		return (
			signUpFormData &&
			signUpFormData.userName !== "" &&
			signUpFormData.userEmail !== "" &&
			signUpFormData.password !== ""
		);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-gray-800">
			<header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-300">
				<Link to="/" className="flex items-center space-x-2">
					<GraduationCapIcon className="h-8 w-8 text-gray-800 animate-bounce" />
					<span className="font-bold text-2xl lg:text-3xl">LMS LEARN</span>
				</Link>
			</header>

			<main className="flex items-center justify-center px-4 sm:px-8 lg:px-0 py-8 md:py-16 lg:py-24 min-h-[calc(100vh-64px)]">
				<Tabs
					value={activeTab}
					defaultValue="signin"
					onValueChange={handleTabChange}
					className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
				>
					<TabsList className="grid grid-cols-2 w-full rounded-lg shadow-lg bg-white mb-6">
						<TabsTrigger
							value="signin"
							className={`py-2 text-sm md:text-base font-medium text-gray-800 transition-all hover:bg-gray-100 ${
								activeTab === "signin" ? "bg-gray-200" : ""
							}`}
						>
							Sign In
						</TabsTrigger>
						<TabsTrigger
							value="signup"
							className={`py-2 text-sm md:text-base font-medium text-gray-800 transition-all hover:bg-gray-100 ${
								activeTab === "signup" ? "bg-gray-200" : ""
							}`}
						>
							Sign Up
						</TabsTrigger>
					</TabsList>

					<TabsContent value="signin">
						<Card className="p-6 space-y-4 bg-white rounded-lg shadow-lg text-gray-800 animate-slide-up">
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
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="signup">
						<Card className="p-6 space-y-4 bg-white rounded-lg shadow-lg text-gray-800 animate-slide-up">
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
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};
