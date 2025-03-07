import { fetchAllCoursesService } from "@/services";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import {
	approveCourseService,
	rejectCourseService,
} from "@/services/admin-course-services";
import { useToast } from "@/hooks/use-toast";

export const AdminCoursesPage = () => {
	const [coursesList, setCoursesList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { toast } = useToast();

	const fetchCourses = async () => {
		try {
			setLoading(true);
			const response = await fetchAllCoursesService();
			if (response.success) {
				setCoursesList(response.data || []);
			} else {
				setError(response.message || "Failed to fetch courses.");
			}
		} catch (err) {
			setError("An error occurred while fetching courses.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	const handleApprove = async (courseId) => {
		try {
			const response = await approveCourseService(courseId);
			if (response.success) {
				fetchCourses();
				toast({
					title: "Success",
					description: "Course approved successfully.",
					variant: "success",
				});
			} else {
				toast({
					title: "Error",
					description: response.message || "Failed to approve course.",
					variant: "destructive",
				});
			}
		} catch (err) {
			toast({
				title: "Error",
				description: "An unexpected error occurred.",
				variant: "destructive",
			});
		}
	};

	const handleReject = async (courseId) => {
		try {
			const response = await rejectCourseService(courseId);
			if (response.success) {
				fetchCourses();
				toast({
					title: "Success",
					description: "Course rejected successfully.",
					variant: "success",
				});
			} else {
				toast({
					title: "Error",
					description: response.message || "Failed to reject course.",
					variant: "destructive",
				});
			}
		} catch (err) {
			toast({
				title: "Error",
				description: "An unexpected error occurred.",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return (
			<div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
					<p className="mt-4 text-gray-600 dark:text-gray-400">
						Loading courses...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
					<p className="mt-4 text-lg text-gray-800 dark:text-gray-200">
						{error}
					</p>
					<Button
						onClick={fetchCourses}
						className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
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
				<header className="mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
						Admin Courses Management
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						{coursesList.filter((courseItem) => !courseItem.isPublished).length}{" "}
						courses pending approval
					</p>
				</header>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{coursesList.map((courseItem, index) => (
						<motion.div
							key={courseItem?._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							whileHover={{ scale: 1.03 }}
							className="cursor-pointer"
						>
							<Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
								<div className="relative">
									<img
										src={courseItem.image || "/placeholder-course.jpg"}
										alt={courseItem.title}
										className="w-full h-40 sm:h-48 object-cover"
									/>
									{!courseItem.isPublished && (
										<span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
											Pending
										</span>
									)}
								</div>
								<div className="p-4 sm:p-6 flex-1 flex flex-col">
									<CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
										{courseItem.title || "Untitled Course"}
									</CardTitle>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										by{" "}
										<span className="font-semibold">
											{courseItem.instructorName || "Unknown Instructor"}
										</span>
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
										{courseItem.curriculum?.length || 0} lectures
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
										Level: {courseItem.level || "N/A"}
									</p>
									<p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-auto">
										${courseItem.pricing || "0.00"}
									</p>
								</div>
								<div className="p-4 sm:p-6 pt-0 flex flex-col space-y-2">
									<Button
										variant="outline"
										size="sm"
										className="w-full text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
									>
										View Details
									</Button>
									<div className="flex space-x-2">
										<Button
											className="flex-1 bg-green-500 hover:bg-green-600 text-white"
											onClick={() => handleApprove(courseItem._id)}
										>
											Approve
										</Button>
										<Button
											className="flex-1 bg-red-500 hover:bg-red-600 text-white"
											onClick={() => handleReject(courseItem._id)}
										>
											Reject
										</Button>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};
