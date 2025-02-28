import React, { useContext, useState } from "react";
import { CommonForm } from "@/components/ui/common-form";
import { initialReviewFormData, reviewFormControls } from "@/config";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createReviewService, mediaUploadService } from "@/services";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { useEffect } from "react";
export const StudentReviewPage = () => {
	const {
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(InstructorContext);

	const [reviewFormData, setReviewFormData] = useState(initialReviewFormData);
	const [finalReviewData, setFinalReviewData] = useState({});

	const handleImageUploadChange = async (event) => {
		const seletedImage = event.target.files[0];
		if (seletedImage) {
			const imageFormData = new FormData();
			imageFormData.append("file", seletedImage);
			try {
				setMediaUploadProgress(true);
				const response = await mediaUploadService(
					imageFormData,
					setMediaUploadProgressPercentage
				);
				if (response.success) {
					setFinalReviewData({
						...reviewFormData,
						image: response.data.url,
					});
					setMediaUploadProgress(false);
				}
			} catch (error) {
				console.log(error);
				setMediaUploadProgress(false);
			}
		}
	};

	useEffect(() => {
		setFinalReviewData({
			...finalReviewData,
			...reviewFormData,
		});
	}, [reviewFormData]);

	console.log(finalReviewData, "final");

	const validateReviewForm = () => {
		return (
			finalReviewData &&
			finalReviewData.image !== "" &&
			finalReviewData.quote !== "" &&
			finalReviewData.userName !== "" &&
			finalReviewData.role !== ""
		);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await createReviewService(finalReviewData);
			if (response.success) {
				console.log(response);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center px-4 sm:px-8 lg:px-0 py-8 md:py-16 lg:py-24 min-h-[calc(100vh-64px)]">
			{finalReviewData.image ? (
				<img src={finalReviewData.image} />
			) : (
				<div className="flex flex-col gap-3">
					<Label>Upload Course Image</Label>
					<Input
						type="file"
						className="mb-4"
						accept="image/*"
						onChange={(event) => handleImageUploadChange(event)}
					/>
				</div>
			)}
			<Card className="p-4 sm:p-6 space-y-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl text-gray-800 animate-slide-up">
				<CardHeader>
					<CardTitle className="text-lg md:text-xl font-bold">
						How Was Your Experience
					</CardTitle>
					<CardDescription className="text-sm md:text-base text-gray-600">
						Tell us about our plateform , share your thoughts with us
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<CommonForm
						formControls={reviewFormControls}
						formData={reviewFormData}
						setFormData={setReviewFormData}
						buttonText={"Submit Review"}
						handleSubmit={handleSubmit}
						isButtonDisabled={!validateReviewForm()}
					/>
				</CardContent>
			</Card>
		</div>
	);
};
