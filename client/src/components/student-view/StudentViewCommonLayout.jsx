import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const StudentViewCommonLayout = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-gray-800">
			<Header />
			<Outlet />
		</div>
	);
};
