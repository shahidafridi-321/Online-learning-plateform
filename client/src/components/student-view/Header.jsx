import { GraduationCapIcon, MoonIcon, Sun, TvMinimalPlay } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const Header = () => {
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(false);
	const { resetCredentials, auth } = useContext(AuthContext);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.clear();
		navigate("/auth");
	};

	return (
		<header className="px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Left Side: Logo & Navigation */}
				<div className="flex items-center space-x-4">
					<Link to="/" className="flex items-center space-x-2">
						<GraduationCapIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
						<span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
							Learn For Fun
						</span>
					</Link>
					<Button
						variant="ghost"
						onClick={() => navigate("/courses")}
						className="text-lg dark:text-gray-300"
					>
						Explore Courses
					</Button>
				</div>

				{/* Right Side: User Actions */}
				<div className="flex items-center space-x-6">
					<div
						onClick={() => navigate("/student-courses")}
						className="flex items-center cursor-pointer"
					>
						<TvMinimalPlay className="h-8 w-8 text-gray-700 dark:text-gray-300" />
						<span className="ml-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
							My Courses
						</span>
					</div>
					<Button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
					>
						{auth?.user ? "Sign Out" : "Sign In"}
					</Button>
					<Button
						variant="ghost"
						onClick={() => setDarkMode(!darkMode)}
						className="p-2 rounded-full"
					>
						{darkMode ? (
							<Sun className="h-6 w-6 text-yellow-500" />
						) : (
							<MoonIcon className="h-6 w-6 text-gray-700" />
						)}
					</Button>
				</div>
			</div>
		</header>
	);
};
