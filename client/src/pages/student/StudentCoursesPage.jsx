import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context/StudentContext";
import { fetchStudentBoughtCoursesService } from "@/services";
import { BookOpen, Eye } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const StudentCoursesPage = () => {
	const {
		studentBoughtCoursesList,
		setStudentBoughtCoursesList,
		studentViewCourseList,
	} = useContext(StudentContext);

	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();

	const fetchStudentBoughtCourses = async () => {
		const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
		if (response?.success) {
			setStudentBoughtCoursesList(response?.data);
		}
	};

	useEffect(() => {
		fetchStudentBoughtCourses();
	}, []);

	// Create a Set of bought course IDs using courseId
	const studentBoughtCoursesIds = new Set(
		studentBoughtCoursesList.map((course) => course.courseId)
	);

	// Filter recommended courses to exclude bought courses
	const recommendedCourses = studentViewCourseList
		.filter((course) => !studentBoughtCoursesIds.has(course._id))
		.slice(0, 3);

	return (
		<div className="p-6 max-w-7xl mx-auto relative">
			<div className="absolute inset-0 -z-10 opacity-10 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-900 dark:to-blue-900" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* Welcome Section */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 dark:from-purple-300 dark:via-pink-300 dark:to-blue-200 bg-clip-text text-transparent animate-gradient"
				>
					Welcome back, {auth?.user.userName}!
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-8 font-medium"
				>
					Dive into your learning adventure today
				</motion.p>

				{studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{studentBoughtCoursesList.map((course, index) => (
							<motion.div
								key={course?._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: index * 0.15,
									type: "spring",
									stiffness: 100,
								}}
								whileHover={{ scale: 1.03, y: -5 }}
								className="group"
							>
								<Card className="relative h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
									<div className="relative aspect-video overflow-hidden">
										<img
											src={course.courseImage}
											alt={course.title}
											className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
										<span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
											In Progress
										</span>
									</div>
									<CardContent className="p-4 flex-grow space-y-3">
										<h3 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-white">
											{course?.title}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											by {course?.instructorName}
										</p>
										<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
											<motion.div
												className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full"
												initial={{ width: 0 }}
												animate={{
													width: `${Math.min((index + 1) * 20, 100)}%`,
												}}
												transition={{ duration: 1, delay: index * 0.15 }}
											/>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{Math.min((index + 1) * 20, 100)}% Complete
										</p>
									</CardContent>
									<CardFooter className="p-4">
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button
												onClick={() =>
													navigate(`/course-progress/${course?.courseId}`)
												}
												className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
											>
												<Eye className="mr-2 h-4 w-4 text-white/90" />
												Continue Learning
											</Button>
										</motion.div>
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col items-center justify-center min-h-[400px] space-y-8 text-center"
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.6, type: "spring" }}
							whileHover={{ rotate: 10, scale: 1.1 }}
							className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 rounded-full shadow-lg"
						>
							<BookOpen className="h-20 w-20 text-white" />
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 dark:from-purple-300 dark:via-pink-300 dark:to-blue-200 bg-clip-text text-transparent"
						>
							No Courses Yet?
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-lg"
						>
							Kickstart your learning journey with our expertly curated courses
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.6 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								onClick={() => navigate("/courses")}
								className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
							>
								Explore Courses Now
							</Button>
						</motion.div>
					</motion.div>
				)}
			</motion.div>

			{/* Suggested Courses Section */}
			<motion.section
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.8 }}
				className="mt-12"
			>
				<h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
					Discover More Courses
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{recommendedCourses.map((course, index) => (
						<motion.div
							key={course._id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								delay: index * 0.15,
								type: "spring",
								stiffness: 120,
							}}
							whileHover={{ scale: 1.03, y: -5 }}
							className="group"
						>
							<Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
								<div className="relative aspect-video overflow-hidden">
									<img
										src={course.image}
										alt={course.title}
										className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
								</div>
								<CardContent className="p-4 flex-grow space-y-2">
									<h3 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-white">
										{course.title}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										by {course.instructorName}
									</p>
								</CardContent>
								<CardFooter className="p-4">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											onClick={() => navigate(`/course/details/${course._id}`)}
											className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
										>
											Enroll Now
										</Button>
									</motion.div>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>
				<div className="mt-8 text-center">
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Button
							onClick={() => navigate("/courses")}
							className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
						>
							See All Courses
						</Button>
					</motion.div>
				</div>
			</motion.section>
		</div>
	);
};
