import React, { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { mediaUploadService } from "@/services";
import { MediaProgressBar } from "../MediaProgressBar";
export const CourseSetting = () => {
	const {
		courseLandingFormData,
		setCourseLandingFormData,
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(InstructorContext);

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
					setCourseLandingFormData({
						...courseLandingFormData,
						image: response.data.url,
					});
					setMediaUploadProgress(false);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};
	console.log(courseLandingFormData);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Setting</CardTitle>
			</CardHeader>
			<div className="p-4">
				{mediaUploadProgress ? (
					<MediaProgressBar
						isMediaUploading={mediaUploadProgress}
						progress={mediaUploadProgressPercentage}
					/>
				) : null}
			</div>
			<CardContent>
				{courseLandingFormData?.image ? (
					<img src={courseLandingFormData.image} />
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
			</CardContent>
		</Card>
	);
};
