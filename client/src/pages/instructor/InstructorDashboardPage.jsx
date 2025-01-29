import { BarChart, Book, LogOut } from "lucide-react";
import React from "react";
import { InstructorDashboard } from "./InstructorDashboard";
import { InstructorCourses } from "./InstructorCourses";
import { Button } from "@/components/ui/button";

export const InstructorDashboardPage = () => {
	const menuItems = [
		{
			icon: BarChart,
			label: "Dashboard",
			value: "dashboard",
			component: <InstructorDashboard />,
		},
		{
			icon: Book,
			label: "Courses",
			value: "courses",
			component: <InstructorCourses />,
		},
		{
			icon: LogOut,
			label: "Logout",
			value: "logout",
			component: null,
		},
	];
	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<aside className="w-64 bg-white  shadow-md hidden md:block">
				<div className="p-4">
					<h2 className="text-2xl font-bold mb-4">Instructor View</h2>
					<nav>
						{menuItems.map((menuItem) => (
							<Button
								className="w-full justify-start mb-2"
								key={menuItem.value}
							>
								<menuItem.icon className="mr-2 h-4 w-4" />
								{menuItem.label}
							</Button>
						))}
					</nav>
				</div>
			</aside>
			<main className="flex-1 p-8 overflow-y-auto">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-3xl font-bold mb-8">Dashboard</h1>
				</div>
			</main>
		</div>
	);
};
