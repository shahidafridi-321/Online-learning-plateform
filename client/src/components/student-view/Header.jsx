import { GraduationCapIcon, TvMinimalPlay } from "lucide-react";
import React, { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const Header = () => {
	const { resetCredentials } = useContext(AuthContext);
	const handleLogout = () => {
		resetCredentials();
		sessionStorage.clear();
	};
	return (
		<header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-300 bg-white/50 backdrop-blur-sm">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center justify-between space-x-4">
					<Link
						to="/"
						className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
					>
						<GraduationCapIcon className="h-8 w-8 text-gray-800 animate-bounce" />
						<span className="font-bold text-2xl lg:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
							Learn For Fun
						</span>
					</Link>
					<div className="flex items-center space-x-1">
						<Button
							variant="ghost"
							className="text-[14px] md:text-[16px] font-medium"
						>
							Explore Courses
						</Button>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<div className="flex gap-4 items-center">
						<div className="flex items-center gap-3">
							<span className="font-extrabold md:text-xl text-[14px]">
								My Courses
							</span>
							<TvMinimalPlay className="w-8 h-8 cursor-pointer" />
						</div>
						<Button className="" onClick={handleLogout}>
							Sign Out
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
};
