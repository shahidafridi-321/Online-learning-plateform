import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { StudentContext } from "@/context/student-context/StudentContext";
import {
	checkCoursePurchaseInfoService,
	createPaymentService,
	fetchStudentViewCourseDetailsService,
} from "@/services";
import { Book, CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context";

export const StudentViewCourseDetailsPage = () => {
	// Use context values for course details and loading
	const {
		studentViewCourseDetails,
		setStudentViewCourseDetails,
		loading,
		setLoading,
	} = useContext(StudentContext);
	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();

	const [displayCurrentVideoFreepreview, setDisplayCurrentVideoFreepreview] =
		useState(null);
	const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
	const [approvalUrl, setApprovalUrl] = useState("");

	// When the course id in the URL changes, clear previous details and fetch new ones
	useEffect(() => {
		if (id) {
			setStudentViewCourseDetails(null); // Clear previous course details
			fetchCourseDetails(id);
		}
	}, [id]);

	// Fetch course details using the id from useParams directly
	const fetchCourseDetails = async (courseId) => {
		setLoading(true);
		// Check if the course is purchased; if so, navigate to course progress page
		const purchaseResponse = await checkCoursePurchaseInfoService(
			courseId,
			auth?.user?._id
		);
		if (purchaseResponse.success && purchaseResponse.data) {
			navigate(`/course-progress/${courseId}`);
			return;
		}
		// Otherwise, fetch the course details
		const response = await fetchStudentViewCourseDetailsService(courseId);
		if (response?.success) {
			setStudentViewCourseDetails(response.data);
		} else {
			setStudentViewCourseDetails(null);
		}
		setLoading(false);
	};

	// Clear details when leaving the course details route
	useEffect(() => {
		if (!location.pathname.includes("/course/details")) {
			setStudentViewCourseDetails(null);
		}
	}, [location.pathname]);

	// Open the free preview dialog if a free preview video URL is set
	useEffect(() => {
		if (displayCurrentVideoFreepreview !== null) {
			setShowFreePreviewDialog(true);
		}
	}, [displayCurrentVideoFreepreview]);

	// While loading or if no course details, show a skeleton loader
	if (loading || !studentViewCourseDetails) {
		return <Skeleton />;
	}

	// If an approval URL is present, redirect to it
	if (approvalUrl !== "") {
		window.location.href = approvalUrl;
	}

	// Find the first free preview video in the curriculum
	const getIndexOfFreePreviewUrl =
		studentViewCourseDetails.curriculum?.findIndex(
			(item) => item.freePreview
		) ?? -1;

	// Handle free preview click; navigate to text lecture page or set video URL for preview
	const handleSetFreePreview = (currentItem) => {
		if (currentItem.type === "text") {
			navigate(
				`/course/details/${studentViewCourseDetails._id}/lecture/${currentItem._id}`
			);
		} else {
			setDisplayCurrentVideoFreepreview(currentItem.videoUrl);
		}
	};

	// Handle payment creation for purchasing the course
	const handleCreatePayment = async () => {
		const paymentPayload = {
			userId: auth?.user?._id,
			userName: auth?.user?.userName,
			userEmail: auth?.user?.userEmail,
			orderStatus: "pending",
			paymentMethod: "paypal",
			paymentStatus: "initiated",
			paymentId: "",
			orderDate: new Date(),
			payerId: "",
			instructorId: studentViewCourseDetails?.instructorId,
			instructorName: studentViewCourseDetails?.instructorName,
			courseImage: studentViewCourseDetails?.image,
			courseTitle: studentViewCourseDetails?.title,
			courseId: studentViewCourseDetails?._id,
			coursePricing: studentViewCourseDetails?.pricing,
		};
		const response = await createPaymentService(paymentPayload);
		if (response.success) {
			sessionStorage.setItem(
				"currentOrderId",
				JSON.stringify(response?.data?.orderId)
			);
			setApprovalUrl(response?.data?.approveUrl);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-8">
			<div className="max-w-6xl mx-auto">
				{/* Course Header */}
				<div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 shadow-lg mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						{studentViewCourseDetails.title}
					</h1>
					<p className="text-xl text-gray-700 mb-4">
						{studentViewCourseDetails.subtitle}
					</p>
					<div className="flex flex-wrap gap-4 text-sm text-gray-600">
						<span>
							Added by :{" "}
							<span className="font-medium">
								{studentViewCourseDetails.instructorName}
							</span>
						</span>
						<span>
							Date:{" "}
							<span className="font-medium">
								{studentViewCourseDetails.date.split("T")[0]}
							</span>
						</span>
						<span className="flex items-center gap-1">
							<Globe className="w-4 h-4" />{" "}
							{studentViewCourseDetails.primaryLanguage}
						</span>
						<span>
							{studentViewCourseDetails.students.length}{" "}
							{studentViewCourseDetails.students.length <= 1
								? "Student Enrolled"
								: "Students Enrolled"}
						</span>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Main Content */}
					<main className="flex-grow">
						<Card className="mb-8">
							<CardHeader>
								<CardTitle>What You Will Learn</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="list-disc list-inside space-y-2">
									{studentViewCourseDetails.objectives
										.split(",")
										.map((objective, index) => (
											<li key={index} className="flex items-center">
												<CheckCircle className="mr-2 text-green-500 w-5 h-5" />
												<span className="text-gray-800">{objective}</span>
											</li>
										))}
								</ul>
							</CardContent>
						</Card>
						<Card className="mb-8">
							<CardHeader>
								<CardTitle>Course Description</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-lg text-gray-800">
									{studentViewCourseDetails.description}
								</p>
							</CardContent>
						</Card>
						<Card className="mb-8">
							<CardHeader className="flex flex-row justify-between items-center">
								<CardTitle>Course Content</CardTitle>
								<Button
									onClick={handleCreatePayment}
									className="bg-indigo-600 hover:bg-indigo-700 text-white"
								>
									Buy Now
								</Button>
							</CardHeader>
							<CardContent>
								<ul className="space-y-4">
									{studentViewCourseDetails.curriculum.map(
										(curriculumItem, index) => (
											<li
												key={index}
												className={`flex items-center cursor-pointer ${
													curriculumItem.freePreview
														? "hover:text-indigo-600"
														: "cursor-not-allowed text-gray-400"
												}`}
												onClick={
													curriculumItem.freePreview
														? () => handleSetFreePreview(curriculumItem)
														: null
												}
											>
												{curriculumItem.freePreview ? (
													curriculumItem.type === "text" ? (
														<Book className="mr-2 w-5 h-5 text-indigo-500" />
													) : (
														<PlayCircle className="mr-2 w-5 h-5 text-indigo-500" />
													)
												) : (
													<Lock className="mr-2 w-5 h-5 text-gray-400" />
												)}
												<span className="text-base font-medium">
													{curriculumItem.title}
												</span>
											</li>
										)
									)}
								</ul>
							</CardContent>
						</Card>
					</main>

					{/* Sidebar: Video Preview & Buy Button */}
					{getIndexOfFreePreviewUrl !== -1 &&
						studentViewCourseDetails.curriculum[getIndexOfFreePreviewUrl]
							?.type === "video" && (
							<aside className="w-full md:w-[500px]">
								<Card className="sticky top-8">
									<CardContent className="p-6">
										<div className="aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
											<VideoPlayer
												url={
													studentViewCourseDetails.curriculum[
														getIndexOfFreePreviewUrl
													].videoUrl || ""
												}
												width="100%"
												height="100%"
											/>
										</div>
										<div className="mb-4">
											<span className="text-3xl font-bold text-gray-900">
												${studentViewCourseDetails.pricing}
											</span>
										</div>
										<Button
											onClick={handleCreatePayment}
											className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
										>
											Buy Now
										</Button>
									</CardContent>
								</Card>
							</aside>
						)}
				</div>
			</div>

			{/* Dialog for Video Free Preview */}
			<Dialog
				open={showFreePreviewDialog}
				onOpenChange={() => {
					setShowFreePreviewDialog(false);
					setDisplayCurrentVideoFreepreview(null);
				}}
			>
				<DialogContent className="w-[800px]">
					<DialogHeader>
						<DialogTitle>Course Preview</DialogTitle>
					</DialogHeader>
					<div className="aspect-video rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
						<VideoPlayer
							url={displayCurrentVideoFreepreview}
							width="100%"
							height="100%"
						/>
					</div>
					<div className="flex flex-col gap-4 mt-4">
						{studentViewCourseDetails?.curriculum
							?.filter((item) => item.freePreview)
							.map((filteredItem, index) => (
								<p
									key={index}
									onClick={() => handleSetFreePreview(filteredItem)}
									className="cursor-pointer text-lg font-medium text-indigo-600 hover:underline"
								>
									{filteredItem?.title}
								</p>
							))}
					</div>
					<DialogFooter className="sm:justify-start mt-4">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
