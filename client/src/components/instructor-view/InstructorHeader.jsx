import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/auth-context";

export const InstructorHeader = () => {
	const [darkMode, setDarkMode] = useState(() => {
		const savedMode = localStorage.getItem("darkMode");
		return savedMode ? JSON.parse(savedMode) : false;
	});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { resetCredentials } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.clear();
		navigate("/auth");
	};

	const menuItems = [
		{ label: "Dashboard", path: "/instructor" },
		{ label: "Courses", path: "/instructor/courses" }, // Note: You may need to adjust this path based on routing
		{ label: "Create New Course", path: "/instructor/create-new-course" },
		{ label: "Logout", action: handleLogout },
	];

	return (
		<header className="px-6 py-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo */}
				<Link to="/instructor" className="flex items-center space-x-2">
					<span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
						Instructor Dashboard
					</span>
				</Link>

				{/* Mobile Menu */}
				<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="md:hidden">
							<Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-48 bg-white dark:bg-gray-800"
					>
						{menuItems.map((item, index) => (
							<DropdownMenuItem key={index} className="px-4 py-2">
								{item.path ? (
									<Link
										to={item.path}
										onClick={() => setIsDropdownOpen(false)}
										className="w-full"
									>
										{item.label}
									</Link>
								) : (
									<button onClick={item.action} className="w-full text-left">
										{item.label}
									</button>
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Desktop Controls */}
				<div className="hidden md:flex items-center space-x-4">
					<Button
						variant="ghost"
						onClick={() => setDarkMode(!darkMode)}
						className="p-2"
					>
						{darkMode ? (
							<Sun className="h-6 w-6 text-yellow-500" />
						) : (
							<Moon className="h-6 w-6 text-gray-700" />
						)}
					</Button>
					<Button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
					>
						Sign Out
					</Button>
				</div>
			</div>
		</header>
	);
};
