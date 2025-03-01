import {
	MenuIcon,
	MoonIcon,
	Sun,
	LogOut,
	Home,
	BookOpen,
	Users,
	CheckCircle,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "../ui/dropdown-menu";

export const AdminHeader = () => {
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(() => {
		const savedMode = localStorage.getItem("darkMode");
		return savedMode ? JSON.parse(savedMode) : false;
	});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { resetCredentials, auth } = useContext(AuthContext);

	// Toggle dark mode
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		// Save the current preference to localStorage
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	// Toggle function for the dark mode button
	const toggleDarkMode = () => {
		setDarkMode((prevMode) => !prevMode);
	};

	// Close dropdown when resizing to desktop
	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		const handleMediaChange = (e) => {
			if (e.matches) {
				setIsDropdownOpen(false);
			}
		};
		mediaQuery.addEventListener("change", handleMediaChange);
		if (mediaQuery.matches) {
			setIsDropdownOpen(false);
		}
		return () => mediaQuery.removeEventListener("change", handleMediaChange);
	}, []);

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.clear();
		navigate("/auth");
	};

	return (
		<header className="px-6 py-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Left Side: Logo & Navigation */}
				<div className="flex items-center space-x-4">
					<Link to="/admin/dashboard" className="flex items-center space-x-2">
						<Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
						<span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
							Admin Dashboard
						</span>
					</Link>
				</div>

				{/* Right Side: User Actions */}
				{/* Mobile Hamburger Menu */}
				<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<button className="block md:hidden">
							<MenuIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
					>
						<DropdownMenuItem className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900">
							<Link to="/admin/dashboard" className="flex items-center w-full">
								<Home className="h-5 w-5 text-gray-700 dark:text-gray-300" />
								<span className="ml-2">Dashboard</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900">
							<Link to="/admin/courses" className="flex items-center w-full">
								<BookOpen className="h-5 w-5 text-gray-700 dark:text-gray-300" />
								<span className="ml-2">Courses</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900">
							<Link to="/admin/users" className="flex items-center w-full">
								<Users className="h-5 w-5 text-gray-700 dark:text-gray-300" />
								<span className="ml-2">Users</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900">
							<Link
								to="/admin/approve-reject-review"
								className="flex items-center w-full"
							>
								<CheckCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />
								<span className="ml-2">Reviews</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900">
							<Button
								onClick={handleLogout}
								className="w-full flex items-center text-left text-gray-900 dark:text-gray-100 bg-transparent hover:bg-transparent"
							>
								<LogOut className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
								Sign Out
							</Button>
						</DropdownMenuItem>
						<DropdownMenuItem className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900">
							<Button
								variant="ghost"
								onClick={toggleDarkMode}
								className="w-full flex items-center text-gray-900 dark:text-gray-100"
							>
								{darkMode ? (
									<>
										<Sun className="h-5 w-5 text-yellow-500 mr-2" />
										<span>Light Mode</span>
									</>
								) : (
									<>
										<MoonIcon className="h-5 w-5 text-gray-700 mr-2" />
										<span>Dark Mode</span>
									</>
								)}
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Desktop View */}
				<div className="hidden md:flex items-center space-x-6">
					<Link
						to="/admin/dashboard"
						className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
					>
						Dashboard
					</Link>
					<Link
						to="/admin/courses"
						className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
					>
						Courses
					</Link>
					<Link
						to="/admin/users"
						className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
					>
						Users
					</Link>
					<Link
						to="/admin/approve-reject-review"
						className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
					>
						Reviews
					</Link>
					<Button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
					>
						Sign Out
					</Button>
					<Button
						variant="ghost"
						onClick={toggleDarkMode}
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
