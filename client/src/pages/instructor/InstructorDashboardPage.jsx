import { BarChart, Book, LogOut } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import { InstructorDashboard } from "../../components/instructor-view/InstructorDashboard";
import { InstructorCourses } from "../../components/instructor-view/InstructorCourses";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { fetchInstructorCourseListService } from "@/services";

export const InstructorDashboardPage = () => {
	const [activeTab, setActiveTab] = useState("dashboard");
	const { resetCredentials } = useContext(AuthContext);
	const { instructorCoursesList, setInstructorCoursesList } =
		useContext(InstructorContext);
	const { auth } = useContext(AuthContext);

	const fetchAllCourses = async () => {
		const response = await fetchInstructorCourseListService(auth?.user._id);
		if (response?.success) {
			setInstructorCoursesList(response.data);
		}
	};

	useEffect(() => {
		fetchAllCourses();
	}, []);

	const menuItems = [
		{
			icon: BarChart,
			label: "Dashboard",
			value: "dashboard",
			component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
		},
		{
			icon: Book,
			label: "Courses",
			value: "courses",
			component: <InstructorCourses listOfCourses={instructorCoursesList} />,
		},
		{
			icon: LogOut,
			label: "Logout",
			value: "logout",
			component: null,
		},
	];

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.clear();
	};

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-gray-800">
			{/* Sidebar */}
			<aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
				<h2 className="text-2xl font-bold mb-6">Instructor View</h2>
				<nav className="space-y-2">
					{menuItems.map((menuItem) => (
						<Button
							key={menuItem.value}
							className={`w-full flex items-center justify-start text-lg py-3 rounded-lg transition-all font-medium `}
							onClick={
								menuItem.value === "logout"
									? handleLogout
									: () => setActiveTab(menuItem.value)
							}
							variant={activeTab === menuItem.value ? "secondary" : "ghost"}
						>
							<menuItem.icon
								className={`mr-3 h-5 w-5 ${
									activeTab === menuItem.value
										? "text-gray-900"
										: "text-gray-600"
								}`}
							/>
							{menuItem.label}
						</Button>
					))}
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8 overflow-y-auto">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-3xl font-bold mb-8">Dashboard</h1>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						{menuItems.map((menuItem) => (
							<TabsContent key={menuItem.value} value={menuItem.value}>
								{menuItem.component !== null ? menuItem.component : null}
							</TabsContent>
						))}
					</Tabs>
				</div>
			</main>
		</div>
	);
};
