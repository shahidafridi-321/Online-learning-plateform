import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import React, { useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { courseCurriculumInitialFormData } from "@/config";
import {
	mediaBulkUploadService,
	mediaDeleteService,
	mediaUploadService,
} from "@/services";
import { MediaProgressBar } from "../MediaProgressBar";
import { VideoPlayer } from "../video-player/VideoPlayer";
import { useRef } from "react";
import { Upload } from "lucide-react";

export const CourseCurriculum = () => {
	const {
		courseCurriculumFormData,
		setCourseCurriculumFormData,
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(InstructorContext);

	const bulkUploadInputRef = useRef(null);

	const handleNewLecture = () => {
		setCourseCurriculumFormData([
			...courseCurriculumFormData,
			{
				...courseCurriculumInitialFormData[0],
			},
		]);
	};

	const handleCurseTitleChange = (event, currentIndex) => {
		let copyCourseCurriculumFormData = [...courseCurriculumFormData];
		copyCourseCurriculumFormData[currentIndex] = {
			...copyCourseCurriculumFormData[currentIndex],
			title: event.target.value,
		};
		setCourseCurriculumFormData(copyCourseCurriculumFormData);
	};

	const handleFreeprviewPChange = (currentValue, currentIndex) => {
		let copyCourseCurriculumFormData = [...courseCurriculumFormData];
		copyCourseCurriculumFormData[currentIndex] = {
			...copyCourseCurriculumFormData[currentIndex],
			freePreview: currentValue,
		};
		setCourseCurriculumFormData(copyCourseCurriculumFormData);
	};

	const handleSingleFileUpload = async (event, currentIndex) => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			const videoFormData = new FormData();
			videoFormData.append("file", selectedFile);

			try {
				setMediaUploadProgress(true);
				const response = await mediaUploadService(
					videoFormData,
					setMediaUploadProgressPercentage
				);
				if (response.success) {
					let copyCourseCurriculumFormData = [...courseCurriculumFormData];
					copyCourseCurriculumFormData[currentIndex] = {
						...copyCourseCurriculumFormData[currentIndex],
						videoUrl: response?.data?.url,
						public_id: response?.data?.public_id,
					};
					setCourseCurriculumFormData(copyCourseCurriculumFormData);
					setMediaUploadProgress(false);
				}
			} catch (error) {
				console.log(error);
				setMediaUploadProgress(false);
			}
		}
	};

	const isCurriculumFormDataValid = () => {
		return courseCurriculumFormData.every((item) => {
			return (
				item &&
				typeof item === "object" &&
				item.title.trim() !== "" &&
				item.videoUrl.trim() !== "" &&
				item.title.trim() !== ""
			);
		});
	};

	const handleVideoReplace = async (currentIndex) => {
		let copyCourseCurriculumFormData = [...courseCurriculumFormData];
		const getCurrentVideoPublicId =
			copyCourseCurriculumFormData[currentIndex].public_id;
		const deleteCurrentMediaResponse = mediaDeleteService(
			getCurrentVideoPublicId
		);
		if (deleteCurrentMediaResponse?.success) {
			copyCourseCurriculumFormData[currentIndex] = {
				...copyCourseCurriculumFormData[currentIndex],
				videoUrl: "",
				public_id: "",
			};
			setCourseCurriculumFormData(copyCourseCurriculumFormData);
		}
	};

	const areAllCourseCurriculumFormDataObjectsAreEmpty = (arr) => {
		return arr.every((obj) => {
			return Object.entries(obj).every(([key, value]) => {
				if (typeof value === "boolean") {
					return true;
				}
				return value === "";
			});
		});
	};

	const handleOpenBulkUploadDialog = () => {
		bulkUploadInputRef.current?.click();
	};

	const handleMediaBulkUpload = async (event) => {
		const seletedFiles = Array.from(event.target.files);
		const bulkFormData = new FormData();
		seletedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

		try {
			setMediaUploadProgress(true);
			const response = await mediaBulkUploadService(
				bulkFormData,
				setMediaUploadProgressPercentage
			);

			if (response?.success) {
				let copyCourseCurriculumFormData =
					areAllCourseCurriculumFormDataObjectsAreEmpty(
						courseCurriculumFormData
					)
						? []
						: [...courseCurriculumFormData];

				copyCourseCurriculumFormData = {
					...copyCourseCurriculumFormData,
					...response?.data.map((item, index) => ({
						videoUrl: item?.url,
						public_id: item?.public_id,
						title: `Lecture ${
							copyCourseCurriculumFormData.length + (index + 1)
						}`,
						freePreview: false,
					})),
				};
				setCourseCurriculumFormData(copyCourseCurriculumFormData);
				setMediaUploadProgress(false);
			}
		} catch (error) {
			console.log(error);
			setMediaUploadProgress(false);
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between">
				<CardTitle>Create Course Curriculum</CardTitle>
				<div>
					<Input
						type="file"
						ref={bulkUploadInputRef}
						accept="video/*"
						multiple
						className="hidden"
						id="bulk-media-upload"
						onChange={handleMediaBulkUpload}
					/>
					<Button
						as="label"
						htmlFor="bulk-media-upload"
						variant="outline"
						className="cursor-pointer"
						onClick={handleOpenBulkUploadDialog}
					>
						<Upload className="w-4 h-4 mr-2" />
						Bulk Upload
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Button
					disabled={!isCurriculumFormDataValid() || mediaUploadProgress}
					onClick={handleNewLecture}
				>
					Add Lecture
				</Button>
				{mediaUploadProgress ? (
					<MediaProgressBar
						isMediaUploading={mediaUploadProgress}
						progress={mediaUploadProgressPercentage}
					/>
				) : null}
				<div className="mt-4 space-y-4">
					{courseCurriculumFormData.map((curriculumItem, index) => (
						<div className="border p-5 rounded-md" key={index}>
							<div className="flex gap-5 items-center">
								<h3 className="font-semibold">Lecture {index + 1}</h3>
								<Input
									name={`title-${index + 1}`}
									placeholder="Enter Lecture Title"
									className="max-w-96"
									onChange={(event) => handleCurseTitleChange(event, index)}
									value={courseCurriculumFormData[index]?.title}
								/>
								<div className="flex items-center space-x-2">
									<Switch
										onCheckedChange={(value) =>
											handleFreeprviewPChange(value, index)
										}
										checked={courseCurriculumFormData[index]?.freePreview}
										id={`freePreview-${index + 1}`}
									/>
									<Label htmlFor={`freePreview-${index + 1}`}>
										Free Preview
									</Label>
								</div>
							</div>
							<div className="mt-6">
								{courseCurriculumFormData[index]?.videoUrl ? (
									<div className="flex gap-3">
										<VideoPlayer
											url={courseCurriculumFormData[index]?.videoUrl}
											width="450px"
											height="200px"
										/>
										<Button onClick={() => handleVideoReplace(index)}>
											Replace Video
										</Button>
										<Button className="bg-red-900">Delete Lecture</Button>
									</div>
								) : (
									<Input
										type="file"
										accept="video/*"
										className="mb-4 "
										onChange={(event) => {
											handleSingleFileUpload(event, index);
										}}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
