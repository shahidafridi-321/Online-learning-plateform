import React from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminFooter } from "./AdminFooter";

export const AdminCommonLayout = () => {
	return (
		<div
			className="flex flex-col min-h-screen 
                 bg-gray-100 dark:bg-gray-900 
                 text-gray-800 dark:text-gray-100"
		>
			<AdminHeader />
			<Outlet />
			<AdminFooter />
		</div>
	);
};
