import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";

export const StudentViewCommonLayout = () => {
	const location = useLocation();
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-gray-800">
			{!location.pathname.includes("course-progress") ? <Header /> : null}
			<Outlet />
		</div>
	);
};
