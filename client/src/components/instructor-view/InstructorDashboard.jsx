import { DollarSign, Users } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export const InstructorDashboard = ({ listOfCourses }) => {
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
			{
				totalStudents: 0,
				totalProfits: 0,
				studentList: [],
			}
		);
		return {
			totalStudents,
			totalProfits,
			studentList,
		};
	};

	const config = [
		{
			icon: Users,
			label: "Total Students",
			value: calculateTotalStudentsAndProfit().totalStudents,
		},
		{
			icon: DollarSign,
			label: "Total Revenue",
			value: calculateTotalStudentsAndProfit().totalProfits,
		},
	];
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{config.map((item, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{item.label}
							</CardTitle>
							<item.icon className="w-4 h-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{item.value}</div>
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Students List</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto ">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead>Course Name</TableHead>
									<TableHead>Student Name</TableHead>
									<TableHead>Student Email</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{calculateTotalStudentsAndProfit().studentList.map(
									(student, index) => (
										<TableRow key={index}>
											<TableCell>{student.courseTitle}</TableCell>
											<TableCell>{student.studentName}</TableCell>
											<TableCell>{student.studentEmail}</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
