import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import {
	Loader2,
	Users,
	Book,
	CheckCircle,
	AlertCircle,
	BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import {
	fetchAllCoursesService,
	fetchAllUsersService,
	fetchAllReviewsService,
} from "@/services";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const AdminDashboardPage = () => {
	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();

	const [stats, setStats] = useState({
		totalCourses: 0,
		totalUsers: 0,
		pendingReviews: 0,
	});
	const [recentActivity, setRecentActivity] = useState([]);
	const [chartData, setChartData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch dashboard data
	const fetchDashboardData = async () => {
		setIsLoading(true);
		try {
			const [coursesResponse, usersResponse, reviewsResponse] =
				await Promise.all([
					fetchAllCoursesService(),
					fetchAllUsersService(),
					fetchAllReviewsService(),
				]);

			if (
				coursesResponse.success &&
				usersResponse.success &&
				reviewsResponse.success
			) {
				const totalCourses = coursesResponse.data.length;
				const totalUsers = usersResponse.data.length;
				const pendingReviews = reviewsResponse.data.filter(
					(r) => !r.approved
				).length;

				setStats({
					totalCourses,
					totalUsers,
					pendingReviews,
				});

				const courseDates = coursesResponse.data.map((c) =>
					new Date(c.date).getMonth()
				);
				const userDates = usersResponse.data.map((u) =>
					new Date(u.verificationCodeExpires || new Date()).getMonth()
				);
				const months = Array(12).fill(0);
				courseDates.forEach((month) => months[month]++);
				const userMonths = Array(12).fill(0);
				userDates.forEach((month) => userMonths[month]++);

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
							label: "Users Joined",
							data: userMonths,
							backgroundColor: "rgba(153, 102, 255, 0.6)",
							borderColor: "rgba(153, 102, 255, 1)",
							borderWidth: 1,
						},
					],
				});

				const recentCourses = coursesResponse.data.slice(0, 3).map((c) => ({
					type: "Course",
					title: c.title,
					date: c.date,
				}));
				const recentUsers = usersResponse.data.slice(0, 3).map((u) => ({
					type: u.role === "user" ? "Student" : "Instructor",
					title: u.userName,
					date: u.verificationCodeExpires || new Date(),
				}));
				const recentReviews = reviewsResponse.data.slice(0, 3).map((r) => ({
					type: "Review",
					title: r.userName,
					date: r.date,
				}));

				setRecentActivity(
					[...recentCourses, ...recentUsers, ...recentReviews]
						.sort((a, b) => new Date(b.date) - new Date(a.date))
						.slice(0, 5)
				);
			} else {
				setError(
					coursesResponse.message ||
						usersResponse.message ||
						reviewsResponse.message ||
						"Failed to fetch dashboard data."
				);
			}
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			setError(
				error.response?.data?.message ||
					"An error occurred while loading the dashboard."
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (auth.authenticate && auth.user?.role === "admin") {
			fetchDashboardData();
		} else {
			navigate("/auth");
		}
	}, [auth, navigate]);

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: document.documentElement.classList.contains("dark")
						? "#e5e7eb"
						: "#374151",
				},
			},
			title: {
				display: true,
				text: "Activity Over the Year",
				color: document.documentElement.classList.contains("dark")
					? "#e5e7eb"
					: "#374151",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					color: document.documentElement.classList.contains("dark")
						? "#e5e7eb"
						: "#374151",
				},
			},
			x: {
				ticks: {
					color: document.documentElement.classList.contains("dark")
						? "#e5e7eb"
						: "#374151",
				},
			},
		},
	};

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
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-8 p-6"
		>
			{/* Header */}
			<div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 p-4 rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
				<Button
					className="bg-white text-indigo-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700 font-medium py-2 px-6 rounded-md shadow-md transition-all hover:shadow-lg"
					onClick={() => navigate("/admin/approve-reject-review")}
				>
					Review Approvals
				</Button>
			</div>

			{/* Stats Section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[
					{
						title: "Total Courses",
						value: stats.totalCourses,
						icon: Book,
						color: "indigo",
					},
					{
						title: "Total Users (Students & Instructors)",
						value: stats.totalUsers,
						icon: Users,
						color: "purple",
					},
					{
						title: "Pending Reviews",
						value: stats.pendingReviews,
						icon: CheckCircle,
						color: "teal",
					},
				].map((stat, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<Card
							className={`bg-gradient-to-br from-${stat.color}-100 to-white dark:from-${stat.color}-900 dark:to-gray-800 shadow-lg rounded-lg hover:shadow-xl transition-shadow`}
						>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
									{stat.title}
								</CardTitle>
								<stat.icon
									className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
								/>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
									{stat.value}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Chart Section */}
			<Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
						<BarChart3 className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
						Activity Overview
					</CardTitle>
				</CardHeader>
				<CardContent>
					{chartData && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<Bar data={chartData} options={chartOptions} />
						</motion.div>
					)}
				</CardContent>
			</Card>

			{/* Recent Activity Section */}
			<Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
						Recent Activity
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<TableHeader>
								<TableRow>
									<TableHead className="text-left text-gray-700 dark:text-gray-300">
										Type
									</TableHead>
									<TableHead className="text-left text-gray-700 dark:text-gray-300">
										Title
									</TableHead>
									<TableHead className="text-left text-gray-700 dark:text-gray-300">
										Date
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentActivity.length > 0 ? (
									recentActivity.map((activity, index) => (
										<motion.tr
											key={index}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
										>
											<TableCell className="text-gray-900 dark:text-gray-100">
												{activity.type}
											</TableCell>
											<TableCell className="text-gray-900 dark:text-gray-100">
												{activity.title}
											</TableCell>
											<TableCell className="text-gray-700 dark:text-gray-300">
												{new Date(activity.date).toLocaleDateString()}
											</TableCell>
										</motion.tr>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center text-gray-500 dark:text-gray-400 py-4"
										>
											No recent activity found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};
