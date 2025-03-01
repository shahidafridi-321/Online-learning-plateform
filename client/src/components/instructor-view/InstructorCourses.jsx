import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import {
	courseCurriculumInitialFormData,
	courseLandingInitialFormData,
} from "@/config";

export const InstructorCourses = ({ listOfCourses }) => {
	const navigate = useNavigate();
	const {
		setCurrentEditedCourseId,
		setCourseLandingFormData,
		setCourseCurriculumFormData,
	} = useContext(InstructorContext);

	return (
		<Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
			<CardHeader className="flex justify-between flex-row items-center">
				<CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
					All Courses
				</CardTitle>
				<Button
					className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors"
					onClick={() => {
						setCurrentEditedCourseId(null);
						setCourseCurriculumFormData(courseCurriculumInitialFormData);
						setCourseLandingFormData(courseLandingInitialFormData);
						navigate("/instructor/create-new-course");
					}}
				>
					Create New Course
				</Button>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<TableHeader>
							<TableRow>
								<TableHead className="text-left text-gray-700 dark:text-gray-300">
									Course
								</TableHead>
								<TableHead className="text-left text-gray-700 dark:text-gray-300">
									Students
								</TableHead>
								<TableHead className="text-left text-gray-700 dark:text-gray-300">
									Revenue
								</TableHead>
								<TableHead className="text-right text-gray-700 dark:text-gray-300">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{listOfCourses && listOfCourses.length > 0 ? (
								listOfCourses.map((course) => (
									<TableRow
										key={course._id}
										className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										<TableCell className="font-medium text-gray-900 dark:text-gray-100">
											{course?.title}
										</TableCell>
										<TableCell className="text-gray-700 dark:text-gray-300">
											{course?.students?.length}
										</TableCell>
										<TableCell className="text-gray-700 dark:text-gray-300">
											${course?.students?.length * course?.pricing}
										</TableCell>
										<TableCell className="text-right space-x-2">
											<Button
												onClick={() =>
													navigate(`/instructor/edit-course/${course?._id}`)
												}
												variant="ghost"
												size="sm"
												className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
											>
												<Edit className="h-5 w-5" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
											>
												<Delete className="h-5 w-5" />
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={4}
										className="text-center text-gray-500 dark:text-gray-400 py-4"
									>
										No courses found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};
