import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseCurriculum } from "@/components/instructor-view/CourseCurriculum";
import { CourseLanding } from "@/components/instructor-view/CourseLanding";
import { CourseSetting } from "@/components/instructor-view/CourseSetting";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { AuthContext } from "@/context/auth-context";
import {
	addNewCourseService,
	fetchInstructorCourseDetailsService,
	updateCourseByIdService,
} from "@/services";
import {
	courseCurriculumInitialFormData,
	courseLandingInitialFormData,
} from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import { InstructorHeader } from "@/components/instructor-view/InstructorHeader"; // Adjust path as needed
import { InstructorFooter } from "@/components/instructor-view/InstructorFooter"; // Adjust path as needed
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export const AddNewCoursePage = () => {
	const {
		courseLandingFormData,
		courseCurriculumFormData,
		setCourseLandingFormData,
		setCourseCurriculumFormData,
		currentEditedCourseId,
		setCurrentEditedCourseId,
	} = useContext(InstructorContext);

	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();
	const params = useParams();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [submissionStatus, setSubmissionStatus] = useState("idle");

	const isEmpty = (value) => {
		if (Array.isArray(value)) {
			return value.length === 0;
		}
		return value === "" || value === null || value === undefined;
	};

	const validateFormData = () => {
		for (const key in courseLandingFormData) {
			if (isEmpty(courseLandingFormData[key])) {
				return false;
			}
		}

		let hasFreePreview = false;
		for (const item of courseCurriculumFormData) {
			if (isEmpty(item.title)) {
				return false;
			}
			if (item.type === "video") {
				if (isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
					return false;
				}
			} else if (item.type === "text") {
				if (isEmpty(item.textContent)) {
					return false;
				}
			} else {
				return false;
			}
			if (item.freePreview) {
				hasFreePreview = true;
			}
		}
		return hasFreePreview;
	};

	const handleCreateCourse = async () => {
		if (!validateFormData()) {
			setError(
				"Please fill all required fields and ensure at least one lecture has a free preview."
			);
			return;
		}

		setSubmissionStatus("submitting");
		const courseFinalFormData = {
			instructorId: auth?.user?._id,
			instructorName: auth?.user?.userName,
			date: new Date(),
			...courseLandingFormData,
			students: [],
			curriculum: courseCurriculumFormData,
		};

		try {
			const response =
				currentEditedCourseId !== null
					? await updateCourseByIdService(
							currentEditedCourseId,
							courseFinalFormData
					  )
					: await addNewCourseService(courseFinalFormData);

			if (response?.success) {
				setSubmissionStatus("success");
				setCourseLandingFormData(courseLandingInitialFormData);
				setCourseCurriculumFormData(courseCurriculumInitialFormData);
				setCurrentEditedCourseId(null);
				setTimeout(() => navigate("/instructor"), 3000); // Redirect after 3 seconds
			} else {
				setError(response.message || "Failed to save the course.");
				setSubmissionStatus("error");
			}
		} catch (error) {
			console.error("Error saving course:", error);
			setError(
				error.response?.data?.message ||
					"An error occurred while saving the course."
			);
			setSubmissionStatus("error");
		}
	};

	const fetchCurrentCourseDetails = async () => {
		setIsLoading(true);
		try {
			const response = await fetchInstructorCourseDetailsService(
				currentEditedCourseId
			);
			if (response?.success) {
				const setCourseFormData = Object.keys(
					courseLandingInitialFormData
				).reduce((current, key) => {
					current[key] =
						response?.data[key] || courseLandingInitialFormData[key];
					return current;
				}, {});
				setCourseLandingFormData(setCourseFormData);
				setCourseCurriculumFormData(
					response?.data?.curriculum || courseCurriculumInitialFormData
				);
			} else {
				setError(response.message || "Failed to load course details.");
			}
		} catch (error) {
			console.error("Error fetching course details:", error);
			setError(
				error.response?.data?.message ||
					"An error occurred while loading course details."
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (currentEditedCourseId !== null) {
			fetchCurrentCourseDetails();
		} else {
			setIsLoading(false);
		}
	}, [currentEditedCourseId]);

	useEffect(() => {
		if (params?.courseId) {
			setCurrentEditedCourseId(params?.courseId);
		}
	}, [params?.courseId]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
			</div>
		);
	}

	if (submissionStatus === "success") {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex items-center justify-center min-h-screen"
			>
				<CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400 mr-4" />
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
						Course {currentEditedCourseId ? "Updated" : "Created"} Successfully!
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mt-4">
						Redirecting to Instructor Dashboard shortly...
					</p>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<InstructorHeader />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex-1 p-6 space-y-6"
			>
				{/* Header */}
				<div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 p-4 rounded-lg shadow-lg">
					<h1 className="text-3xl font-bold text-white">
						{currentEditedCourseId ? "Edit Course" : "Create a New Course"}
					</h1>
					<Button
						className={`bg-white text-indigo-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700 font-medium py-2 px-6 rounded-md shadow-md transition-all hover:shadow-lg ${
							!validateFormData() || submissionStatus === "submitting"
								? "opacity-75 cursor-not-allowed"
								: ""
						}`}
						onClick={handleCreateCourse}
						disabled={!validateFormData() || submissionStatus === "submitting"}
					>
						{submissionStatus === "submitting" ? (
							<>
								<Loader2 className="animate-spin mr-2 h-5 w-5" />
								Submitting...
							</>
						) : (
							"Submit Course"
						)}
					</Button>
				</div>

				{/* Main Content */}
				<Card className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-xl backdrop-blur-sm">
					<CardContent className="p-6">
						<Tabs defaultValue="curriculum" className="space-y-4">
							<TabsList className="flex w-full rounded-lg justify-between bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-2 shadow-md">
								{[
									{ value: "curriculum", label: "Curriculum" },
									{ value: "course-landing-page", label: "Landing Page" },
									{ value: "settings", label: "Settings" },
								].map((tab, index) => (
									<TabsTrigger
										key={tab.value}
										value={tab.value}
										className="flex-grow py-2 px-4 text-sm md:text-base font-medium text-gray-800 dark:text-gray-100 rounded-md transition-all hover:bg-gray-300 dark:hover:bg-gray-600 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-lg"
									>
										{tab.label}
									</TabsTrigger>
								))}
							</TabsList>

							<TabsContent value="curriculum">
								<CourseCurriculum />
							</TabsContent>
							<TabsContent value="course-landing-page">
								<CourseLanding />
							</TabsContent>
							<TabsContent value="settings">
								<CourseSetting />
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				{/* Error Message */}
				{error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex items-center justify-center text-red-500 dark:text-red-400"
					>
						<AlertCircle className="w-6 h-6 mr-2" />
						<p>{error}</p>
					</motion.div>
				)}
			</motion.div>
			<InstructorFooter />
		</div>
	);
};
