import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { StudentContext } from "@/context/student-context/StudentContext";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";

export const StudentViewCourseDetailsPage = () => {
	const {
		studentViewCourseDetails,
		setStudentViewCourseDetails,
		currentCourseDetailsId,
		setCurrentCourseDetailsId,
		loading,
		setLoading,
	} = useContext(StudentContext);

	const [displayCurrentVideoFreepreview, setDisplayCurrentVideoFreepreview] =
		useState(null);
	const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

	const { id } = useParams();

	useEffect(() => {
		if (id) {
			setCurrentCourseDetailsId(id);
		}
	}, [id]);

	const location = useLocation();
	useEffect(() => {
		if (!location.pathname.includes("/course/details")) {
			setStudentViewCourseDetails(null);
			setCurrentCourseDetailsId(null);
		}
	}, [location.pathname]);

	const fetchStudentViewCourseDetails = async () => {
		const response = await fetchStudentViewCourseDetailsService(
			currentCourseDetailsId
		);
		if (response?.success) {
			setStudentViewCourseDetails(response.data);
			setLoading(false);
		} else {
			setStudentViewCourseDetails(null);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (displayCurrentVideoFreepreview !== null) {
			setShowFreePreviewDialog(true);
		}
	}, [displayCurrentVideoFreepreview]);

	useEffect(() => {
		if (currentCourseDetailsId !== null) {
			fetchStudentViewCourseDetails();
		}
	}, [currentCourseDetailsId]);

	if (loading) {
		return <Skeleton />;
	}

	const getIndexOfFreePreviewUrl =
		studentViewCourseDetails !== null
			? studentViewCourseDetails.curriculum.findIndex(
					(item) => item.freePreview
			  )
			: -1;

	const handleSetFreePreview = (getCurrentVideoInfo) => {
		setDisplayCurrentVideoFreepreview(getCurrentVideoInfo?.videoUrl);
	};

	return (
		<div className="w-full mx-auto p-4">
			<div className="bg-gray-900 text-white p-8 rounded-t-lg">
				<h1 className="text-3xl font-bold mb-4">
					{studentViewCourseDetails.title}
				</h1>
				<p className="text-xl mb-4">{studentViewCourseDetails.subtitle}</p>
				<div className="flex items-center space-x-4 mt-2 text-sm">
					<span>Created By {studentViewCourseDetails.instructorName}</span>
					<span>Dated {studentViewCourseDetails.date.split("T")[0]}</span>
					<span className="flex items-center">
						<Globe className="mr-1 h-4 w-4" />
						{studentViewCourseDetails.primaryLanguage}
					</span>
					<span>
						{studentViewCourseDetails.students.length}
						{studentViewCourseDetails.students.length <= 1
							? " Student Is Enrolled"
							: " Students Are Enrolled"}
					</span>
				</div>
			</div>
			<div className="flex flex-col md:flex-row gap-8 mt-8">
				<main className="flex-grow">
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>What you will learn</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="grid grid-cols-1 gap-2">
								{studentViewCourseDetails.objectives
									.split(",")
									.map((objective) => (
										<li key={objective} className="flex items-start">
											<CheckCircle className="mr-2 w-5 h-5 text-green-500 flex-shrink-0" />
											<span>{objective}</span>
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
							<p className="text-xl mt-2">
								{studentViewCourseDetails.description}
							</p>
						</CardContent>
					</Card>
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>Course content</CardTitle>
						</CardHeader>
						<CardContent>
							<ul>
								{studentViewCourseDetails.curriculum.map(
									(curriculumItem, index) => (
										<li
											key={index}
											className={`${
												curriculumItem.freePreview
													? "cursor-pointer"
													: "cursor-not-allowed"
											} flex items-center mb-4`}
											onClick={
												curriculumItem.freePreview
													? () => handleSetFreePreview(curriculumItem)
													: null
											}
										>
											{curriculumItem.freePreview ? (
												<PlayCircle className="mr-2 w-4 h-4" />
											) : (
												<Lock className="mr-2 w-4 h-4" />
											)}
											<span>{curriculumItem.title}</span>
										</li>
									)
								)}
							</ul>
						</CardContent>
					</Card>
				</main>
				<aside className="w-full md:w-[500px]">
					<Card className="sticky top-4">
						<CardContent className="p-6">
							<div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
								<VideoPlayer
									url={
										getIndexOfFreePreviewUrl !== -1
											? studentViewCourseDetails.curriculum[
													getIndexOfFreePreviewUrl
											  ].videoUrl
											: ""
									}
									width="450px"
									height="200px"
								/>
							</div>
							<div className="mb-4">
								<span className="3xl font-bold">
									${studentViewCourseDetails.pricing}
								</span>
							</div>
							<Button className="w-full">Buy Now</Button>
						</CardContent>
					</Card>
				</aside>
			</div>
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
					<div className="aspect-video rounded-lg flex items-center justify-center">
						<VideoPlayer
							url={displayCurrentVideoFreepreview}
							width="450px"
							height="200px"
						/>
					</div>
					<div className="flex flex-col gap-2">
						{studentViewCourseDetails?.curriculum
							?.filter((item) => item.freePreview)
							.map((filteredItem, index) => (
								<p
									key={index}
									onClick={() => handleSetFreePreview(filteredItem)}
									className="cursor-pointer text-[16px] font-medium"
								>
									{filteredItem?.title}
								</p>
							))}
					</div>
					<DialogFooter className="sm:justify-start">
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
