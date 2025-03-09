import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import {
	getAllCourseNotificationsService,
	markNotificationAsReadService,
	deleteNotificationService,
} from "@/services/instructor-notifications-service";
import {
	AlertCircle,
	Loader2,
	CheckCircle,
	XCircle,
	Eye,
	Trash2,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-sonner";

export const InstructorNotificationsPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const [filter, setFilter] = useState("all");
	const [sortOrder, setSortOrder] = useState("desc");
	const { auth } = useContext(AuthContext);

	const fetchAllNotifications = async () => {
		if (!auth?.user?._id) {
			setError("User not authenticated.");
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const response = await getAllCourseNotificationsService(auth.user._id);
			if (response.success) {
				setNotifications(response.data || []);
			} else {
				setError(response.message || "Failed to fetch notifications.");
			}
		} catch (err) {
			setError("An error occurred while fetching notifications.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleMarkAsRead = async (notificationId) => {
		try {
			const response = await markNotificationAsReadService(notificationId);
			if (response.success) {
				setNotifications(
					notifications.map((n) =>
						n._id === notificationId ? { ...n, isRead: true } : n
					)
				);
				toast.success("Success", {
					description: "Notification marked as read.",
				});
			}
		} catch (err) {
			toast.error("Error", {
				description: "Failed to mark notification as read.",
			});
		}
	};

	const handleDelete = async (notificationId) => {
		try {
			const response = await deleteNotificationService(notificationId);
			if (response.success) {
				setNotifications(notifications.filter((n) => n._id !== notificationId));
				toast.success("Success", {
					description: "Notification deleted.",
				});
			}
		} catch (err) {
			toast.error("Error", {
				description: "Failed to delete notification.",
			});
		}
	};

	useEffect(() => {
		fetchAllNotifications();
	}, [auth?.user?._id]);

	const filteredNotifications = notifications
		.filter((n) => {
			if (filter === "all") return true;
			if (filter === "unread") return !n.isRead;
			return n.status === filter;
		})
		.sort((a, b) =>
			sortOrder === "desc"
				? new Date(b.date) - new Date(a.date)
				: new Date(a.date) - new Date(b.date)
		);

	if (isLoading) {
		return (
			<div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
					<p className="mt-4 text-gray-600 dark:text-gray-400">
						Loading Notifications...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
					<p className="mt-4 text-lg text-gray-800 dark:text-gray-200">
						{error}
					</p>
					<Button
						className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
						onClick={fetchAllNotifications}
					>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
							Notifications
						</h1>
						<p className="mt-2 text-gray-600 dark:text-gray-400">
							{filteredNotifications.length} Notification
							{filteredNotifications.length !== 1 ? "s" : ""}
						</p>
					</div>
					<div className="mt-4 sm:mt-0 flex space-x-2">
						<select
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
						>
							<option value="all">All</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
							<option value="unread">Unread</option>
						</select>
						<select
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value)}
							className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
						>
							<option value="desc">Newest First</option>
							<option value="asc">Oldest First</option>
						</select>
					</div>
				</header>

				{filteredNotifications.length === 0 ? (
					<Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
						<CardContent className="p-6 text-center">
							<p className="text-gray-600 dark:text-gray-400">
								No notifications match your criteria.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						{filteredNotifications.map((notification, index) => (
							<motion.div
								key={notification._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								whileHover={{ scale: 1.02 }}
							>
								<Card
									className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border ${
										notification.isRead
											? "border-gray-300 dark:border-gray-600 opacity-75"
											: "border-indigo-200 dark:border-indigo-800"
									} hover:shadow-lg transition-shadow duration-300`}
									role="article"
									aria-labelledby={`notification-title-${notification._id}`}
								>
									<CardHeader className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
										<div className="flex items-center space-x-3">
											{notification.status === "approved" ? (
												<CheckCircle className="h-6 w-6 text-green-500" />
											) : (
												<XCircle className="h-6 w-6 text-red-500" />
											)}
											<CardTitle
												id={`notification-title-${notification._id}`}
												className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
											>
												{notification.courseTitle || "Untitled Course"}
											</CardTitle>
										</div>
										<div className="flex space-x-2">
											{!notification.isRead && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleMarkAsRead(notification._id)}
													className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
													aria-label="Mark notification as read"
												>
													<Eye className="h-4 w-4 mr-2" />
													Mark as Read
												</Button>
											)}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDelete(notification._id)}
												className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
												aria-label="Delete notification"
											>
												<Trash2 className="h-5 w-5" />
											</Button>
										</div>
									</CardHeader>
									<CardContent className="p-4 sm:p-6 space-y-3">
										<p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 font-medium">
											{notification.message}
										</p>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											<span className="font-semibold">Course ID:</span>{" "}
											{notification.courseId || "N/A"}
										</p>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											<span className="font-semibold">Admin Comment:</span>{" "}
											{notification.adminComment || "No comment provided"}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-500">
											Received: {new Date(notification.date).toLocaleString()}
										</p>
										<Link
											to={`/instructor/edit-course/${notification.courseId}`}
											className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
											aria-label={`View details for course ${notification.courseTitle}`}
										>
											View Course Details
										</Link>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
