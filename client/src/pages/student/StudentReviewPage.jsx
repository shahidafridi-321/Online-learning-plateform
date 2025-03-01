import React, { useContext, useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle2 } from "lucide-react"; // Added for placeholder icon

export const StudentReviewPage = () => {
	const navigate = useNavigate();
	const {
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(InstructorContext);

	const [reviewFormData, setReviewFormData] = useState(initialReviewFormData);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [submissionStatus, setSubmissionStatus] = useState("idle");

	// Handle image selection and preview
	const handleImageUploadChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedImage(file);
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
		}
	};

	// Clean up image preview URL
	useEffect(() => {
		return () => {
			if (imagePreview) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	// Form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmissionStatus("submitting");
		try {
			const imageFormData = new FormData();
			imageFormData.append("file", selectedImage);
			setMediaUploadProgress(true);
			const uploadResponse = await mediaUploadService(
				imageFormData,
				setMediaUploadProgressPercentage
			);
			if (uploadResponse.success) {
				const finalReviewData = {
					...reviewFormData,
					image: uploadResponse.data.url,
				};
				const response = await createReviewService(finalReviewData);
				if (response.success) {
					setSubmissionStatus("success");
					setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
				} else {
					setSubmissionStatus("error");
				}
			} else {
				setSubmissionStatus("error");
			}
		} catch (error) {
			console.log(error);
			setSubmissionStatus("error");
		} finally {
			setMediaUploadProgress(false);
		}
	};

	// Form validation
	const validateReviewForm = () => {
		return (
			selectedImage &&
			reviewFormData.quote !== "" &&
			reviewFormData.userName !== "" &&
			reviewFormData.role !== ""
		);
	};

	// Success message
	if (submissionStatus === "success") {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center py-16"
			>
				<h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
					Thank You for Your Review!
				</h2>
				<p className="text-gray-600 dark:text-gray-300 mt-4">
					Your feedback helps us grow. You’ll be redirected to the homepage
					shortly.
				</p>
			</motion.div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center px-4 sm:px-8 lg:px-0 py-8 md:py-16 lg:py-24 min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
			<Card className="p-4 sm:p-6 space-y-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl text-gray-800 dark:text-gray-100 w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-lg md:text-xl font-bold">
						Share Your Experience
					</CardTitle>
					<CardDescription className="text-sm md:text-base text-gray-600 dark:text-gray-300">
						Tell us about your journey with our platform. Your thoughts matter!
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col items-center">
						{imagePreview ? (
							<img
								src={imagePreview}
								alt="Preview"
								className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-500 dark:border-indigo-400"
							/>
						) : (
							<div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
								<UserCircle2 className="w-16 h-16 text-gray-400 dark:text-gray-500" />
							</div>
						)}
						<Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
							Upload Your Photo
						</Label>
						<Input
							type="file"
							accept="image/*"
							onChange={handleImageUploadChange}
							className="mt-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
						/>
					</div>
					<CommonForm
						formControls={reviewFormControls}
						formData={reviewFormData}
						setFormData={setReviewFormData}
						buttonText={"Submit Review"}
						handleSubmit={handleSubmit}
						isButtonDisabled={
							!validateReviewForm() || submissionStatus === "submitting"
						}
						errors={{}} // Assuming errors are handled elsewhere
					/>
					{submissionStatus === "error" && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-red-500 dark:text-red-400 text-center mt-4"
						>
							There was an error submitting your review. Please try again.
						</motion.p>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
