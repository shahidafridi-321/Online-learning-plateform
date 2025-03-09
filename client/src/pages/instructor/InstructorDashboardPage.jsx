import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourseListService } from "@/services";
import { InstructorHeader } from "@/components/instructor-view/InstructorHeader";
import { InstructorFooter } from "@/components/instructor-view/InstructorFooter";
import { InstructorDashboard } from "../../components/instructor-view/InstructorDashboard";
import { InstructorCourses } from "../../components/instructor-view/InstructorCourses";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { InstructorNotificationsPage } from "./InstructorNotificationsPage";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const InstructorDashboardPage = () => {
	const { resetCredentials } = useContext(AuthContext);
	const { instructorCoursesList, setInstructorCoursesList } =
		useContext(InstructorContext);
	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("dashboard");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [chartData, setChartData] = useState(null);

	const fetchAllCourses = async () => {
		setIsLoading(true);
		try {
			const response = await fetchInstructorCourseListService(auth?.user._id);
			if (response?.success) {
				setInstructorCoursesList(response.data);

				// Chart data for course creation and student enrollment over time
				const courseDates = response.data.map((c) =>
					new Date(c.date).getMonth()
				);
				const studentDates = response.data
					.flatMap((c) =>
						c.students.map((s) => new Date(s.dateViewed || c.date))
					)
					.map((d) => d.getMonth());
				const months = Array(12).fill(0);
				courseDates.forEach((month) => months[month]++);
				const studentMonths = Array(12).fill(0);
				studentDates.forEach((month) => studentMonths[month]++);

				setChartData({
					labels: [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec",
					],
					datasets: [
						{
							label: "Courses Created",
							data: months,
							backgroundColor: "rgba(75, 192, 192, 0.6)",
							borderColor: "rgba(75, 192, 192, 1)",
							borderWidth: 1,
						},
						{
							label: "Students Enrolled",
							data: studentMonths,
							backgroundColor: "rgba(255, 159, 64, 0.6)",
							borderColor: "rgba(255, 159, 64, 1)",
							borderWidth: 1,
						},
					],
				});
			} else {
				setError(response.message || "Failed to fetch courses.");
			}
		} catch (error) {
			console.error("Error fetching courses:", error);
			setError(
				error.response?.data?.message ||
					"An error occurred while loading the dashboard."
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (auth.authenticate && auth.user?.role === "instructor") {
			fetchAllCourses();
		} else {
			navigate("/auth");
		}
	}, [auth, navigate]);

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.clear();
		navigate("/auth");
	};

	const menuItems = [
		{
			label: "Dashboard",
			value: "dashboard",
			component: (
				<InstructorDashboard
					listOfCourses={instructorCoursesList}
					chartData={chartData}
				/>
			),
		},
		{
			label: "Courses",
			value: "courses",
			component: <InstructorCourses listOfCourses={instructorCoursesList} />,
		},
		{
			label: "Notifications",
			value: "notifications",
			component: <InstructorNotificationsPage />,
		},
		{
			label: "Logout",
			value: "logout",
			component: null,
			action: handleLogout,
		},
	];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mr-4" />
				<p className="text-gray-800 dark:text-gray-100">{error}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<InstructorHeader />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex-1 space-y-8 p-6"
			>
				{/* Navigation Tabs */}
				<div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 p-4 rounded-lg shadow-lg">
					<h1 className="text-3xl font-bold text-white">
						Instructor Dashboard
					</h1>
					<div className="space-x-4 ">
						{menuItems.map((item) => (
							<Button
								key={item.value}
								className={`text-white dark:text-gray-800 font-medium py-2 px-4 rounded-md shadow-md transition-all hover:shadow-lg ${
									activeTab === item.value
										? "bg-white/20"
										: "bg-transparent hover:bg-white/10"
								}`}
								onClick={item.action || (() => setActiveTab(item.value))}
							>
								{item.label}
							</Button>
						))}
					</div>
				</div>

				{menuItems.map(
					(item) =>
						activeTab === item.value && (
							<motion.div
								key={item.value}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								{item.component}
							</motion.div>
						)
				)}
			</motion.div>
			<InstructorFooter />
		</div>
	);
};
