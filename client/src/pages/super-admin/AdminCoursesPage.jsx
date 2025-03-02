import { testimonials } from "@/config/student-home-page-data";
import { fetchAllCoursesService } from "@/services";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const AdminCoursesPage = () => {
	const [coursesList, setCoursesList] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			const response = await fetchAllCoursesService();
			if (response.success) {
				setCoursesList(response.data);
			}
		};
		fetchCourses();
	}, []);
	console.log(coursesList);

	return (
		<div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					Admin Courses Management
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					{coursesList.filter((course) => !course.isPublished).length} courses
					pending approval
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{coursesList.map((course, index) => (
						<motion.div
							key={course._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
						>
							<div className="flex items-start mb-4 flex-col text-left">
								<img
									src={course.image}
									alt={course.title}
									className="min-w-full max-h-56 rounded-md mr-4 border-2 border-indigo-500 dark:border-indigo-400 mb-4"
								/>
								<div>
									<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
										{course.title}
									</h4>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{course.description}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};
