import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Users, DollarSign, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";

export const InstructorDashboard = ({ listOfCourses, chartData }) => {
	const stats = useMemo(() => {
		return listOfCourses.reduce(
			(acc, course) => {
				const studentCount = course.students.length;
				acc.totalStudents += studentCount;
				acc.totalProfits += course.pricing * studentCount;
				course.students.forEach((student) => {
					acc.studentList.push({
						courseTitle: course.title,
						studentEmail: student.studentEmail,
						studentName: student.studentName,
					});
				});
				return acc;
			},
			{
				totalStudents: 0,
				totalProfits: 0,
				studentList: [],
			}
		);
	}, [listOfCourses]);

	/* 
	const calculateTotalStudentsAndProfit = () => {
		const { totalStudents, totalProfits, studentList } = listOfCourses.reduce(
			(acc, course) => {
				const studentCount = course.students.length;
				acc.totalStudents += studentCount;
				acc.totalProfits += course.pricing * studentCount;
				course.students.forEach((student) => {
					acc.studentList.push({
						courseTitle: course.title,
						studentEmail: student.studentEmail,
						studentName: student.studentName,
					});
				});
				return acc;
			},
			{ totalStudents: 0, totalProfits: 0, studentList: [] }
		);
		return { totalStudents, totalProfits, studentList };
	};

const stats = calculateTotalStudentsAndProfit(); */

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
				text: "Course and Enrollment Activity",
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

	return (
		<div className="space-y-8">
			{/* Stats Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{[
					{
						title: "Total Students",
						value: stats.totalStudents,
						icon: Users,
						color: "indigo",
					},
					{
						title: "Total Revenue",
						value: `$${stats.totalProfits}`,
						icon: DollarSign,
						color: "green",
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
			{chartData && (
				<Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
					<CardHeader>
						<CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
							<BarChart3 className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
							Activity Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<Bar data={chartData} options={chartOptions} />
						</motion.div>
					</CardContent>
				</Card>
			)}

			{/* Students List */}
			<Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
				<CardHeader>
					<CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
						Students List
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<TableHeader>
								<TableRow>
									<TableHead className="text-left text-gray-700 dark:text-gray-300">
										Course Name
									</TableHead>
									<TableHead className="text-left text-gray-700 dark:text-gray-300">
										Student Name
									</TableHead>
									<TableHead className="text-left text-gray-700 dark:text-gray-300">
										Student Email
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{stats.studentList.length > 0 ? (
									stats.studentList.map((student, index) => (
										<motion.tr
											key={index}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
										>
											<TableCell className="text-gray-900 dark:text-gray-100">
												{student.courseTitle}
											</TableCell>
											<TableCell className="text-gray-900 dark:text-gray-100">
												{student.studentName}
											</TableCell>
											<TableCell className="text-gray-700 dark:text-gray-300">
												{student.studentEmail}
											</TableCell>
										</motion.tr>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center text-gray-500 dark:text-gray-400 py-4"
										>
											No students enrolled yet.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
