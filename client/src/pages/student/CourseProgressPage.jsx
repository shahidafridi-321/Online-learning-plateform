import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactConfetti from "react-confetti";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	ChevronLeft,
	ChevronRight,
	Circle,
	CircleCheckBigIcon,
} from "lucide-react";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context/StudentContext";
import {
	getCurrentCourseProgressService,
	markLectureAsViewedService,
	resetCourseProgressService,
} from "@/services";

// CodeBlock for rendering code with syntax highlighting
const CodeBlock = ({ node, inline, className, children, ...props }) => {
	const [copied, setCopied] = useState(false);
	const match = /language-(\w+)/.exec(className || "");
	const code = String(children).replace(/\n$/, "");

	const copyToClipboard = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (inline) {
		return (
			<code className={className} {...props}>
				{children}
			</code>
		);
	} else {
		return (
			<div className="relative my-4">
				<button
					onClick={copyToClipboard}
					className="absolute right-2 top-2 z-10 bg-gray-200 text-gray-800 rounded px-2 py-1 text-xs hover:bg-gray-300"
				>
					{copied ? "Copied!" : "Copy"}
				</button>
				<SyntaxHighlighter
					language={match ? match[1] : ""}
					style={oneDark}
					showLineNumbers={true}
					customStyle={{ borderRadius: "0.5rem" }}
					{...props}
				>
					{code}
				</SyntaxHighlighter>
			</div>
		);
	}
};

export const CourseProgressPage = () => {
	const navigate = useNavigate();
	const { auth } = useContext(AuthContext);
	const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
		useContext(StudentContext);
	const [lockCourse, setLockCourse] = useState(false);
	const [currentLecture, setCurrentLecture] = useState(null);
	const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
		useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [isSideBarOpen, setIsSideBarOpen] = useState(false);
	const { id } = useParams();

	const fetchCurrentCourseProgress = async () => {
		const response = await getCurrentCourseProgressService(auth?.user?._id, id);
		if (response?.success) {
			if (!response?.data?.isPurchased) {
				setLockCourse(true);
			} else {
				const { courseDetails, progress, completed } = response.data;
				setStudentCurrentCourseProgress({ courseDetails, progress });

				if (completed) {
					setShowCourseCompleteDialog(true);
					setShowConfetti(true);
					return;
				}

				// If no progress exists, start from the first lecture
				if (!progress || progress.length === 0) {
					setCurrentLecture(courseDetails.curriculum[0]);
				} else {
					let lastViewedIndex = -1;
					courseDetails.curriculum.forEach((lecture, index) => {
						const progressItem = progress.find(
							(p) => p.lectureId === lecture._id
						);
						if (progressItem && progressItem.viewed) {
							lastViewedIndex = index;
						}
					});
					const nextLecture = courseDetails.curriculum[lastViewedIndex + 1];
					setCurrentLecture(nextLecture);
				}
			}
		}
	};

	const updateCourseProgress = async () => {
		if (currentLecture) {
			const response = await markLectureAsViewedService(
				auth?.user?._id,
				studentCurrentCourseProgress?.courseDetails?._id,
				currentLecture?._id
			);
			if (response?.success) {
				await fetchCurrentCourseProgress();
			}
		}
	};

	// This handler is called when the video ends
	const handleVideoEnded = async () => {
		await updateCourseProgress();
	};

	const handleReWatchCourse = async () => {
		const response = await resetCourseProgressService(
			auth?.user?._id,
			studentCurrentCourseProgress?.courseDetails?._id
		);
		if (response?.success) {
			// Clear any local state flags and re-fetch progress to reset UI
			setCurrentLecture(null);
			setShowConfetti(false);
			setShowCourseCompleteDialog(false);
			await fetchCurrentCourseProgress(); // This should load the first lecture again
		}
	};

	//
	const handleLectureChange = (lectureId) => {
		const nextLecture =
			studentCurrentCourseProgress?.courseDetails.curriculum.find(
				(lecture) => lecture._id === lectureId
			);
		if (nextLecture) {
			setCurrentLecture(nextLecture);
		}
	};

	useEffect(() => {
		fetchCurrentCourseProgress();
	}, [id]);

	useEffect(() => {
		if (showConfetti) {
			const timer = setTimeout(() => {
				setShowConfetti(false);
			}, 15000);
			return () => clearTimeout(timer);
		}
	}, [showConfetti]);

	return (
		<div className="flex flex-col bg-[#1c1d1f] text-white">
			{showConfetti && <ReactConfetti />}
			<div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
				<div className="flex items-center space-x-4">
					<Button
						className="text-white"
						variant="ghost"
						size="sm"
						onClick={() => navigate("/student-courses")}
					>
						<ChevronLeft className="h-4 w-4 mr-2" />
						Back to My Courses Page
					</Button>
					<h1 className="text-lg font-bold hidden md:block">
						{studentCurrentCourseProgress?.courseDetails?.title}
					</h1>
				</div>
				<Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
					{isSideBarOpen ? (
						<ChevronRight className="w-5 h-5" />
					) : (
						<ChevronLeft className="w-5 h-5" />
					)}
				</Button>
			</div>
			<div className="flex flex-1">
				<div
					className={`flex-1 ${
						isSideBarOpen ? "mr-[400px]" : ""
					} transition-all duration-300`}
				>
					{currentLecture &&
						(currentLecture?.type === "video" ? (
							<VideoPlayer
								key={currentLecture._id} // Force remount when lecture changes
								width="100%"
								height="550px"
								url={currentLecture?.videoUrl}
								onEnded={handleVideoEnded}
							/>
						) : (
							<div className="markdown-body bg-[#1c1d1f] bg-opacity-80 backdrop-blur-sm p-8 rounded-lg shadow-md my-4 text-base leading-relaxed">
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{ code: CodeBlock }}
									className="text-gray-200"
								>
									{currentLecture.textContent}
								</ReactMarkdown>
								<button
									/* onClick={handleNextLecture} */
									onClick={updateCourseProgress}
								>
									Mark as Completed
								</button>
							</div>
						))}
					<div className="p-6 bg-[#1c1d1f]">
						<h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
					</div>
				</div>
				<div
					className={`absolute right-0 w-[400px] border-l border-gray-700 transition-all duration-300 ${
						isSideBarOpen ? "translate-x-0" : "translate-x-full"
					}`}
				>
					<Tabs defaultValue="content" className="h-full flex flex-col">
						<TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
							<TabsTrigger
								value="content"
								className="bg-white text-black rounded-none h-full"
							>
								Course Content
							</TabsTrigger>
							<TabsTrigger
								value="overview"
								className="bg-white text-black rounded-none h-full"
							>
								Overview
							</TabsTrigger>
						</TabsList>
						<TabsContent value="content">
							<ScrollArea className="h-full">
								<div className="p-4 space-y-4">
									{studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
										(lecture) => (
											<div
												key={lecture?._id}
												className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
											>
												<Button
													variant="ghost"
													onClick={() => handleLectureChange(lecture?._id)}
												>
													{studentCurrentCourseProgress?.progress?.find(
														(progressItem) =>
															progressItem.lectureId === lecture?._id
													)?.viewed ? (
														<CircleCheckBigIcon className="h-5 w-5 text-green-500" />
													) : (
														<Circle className="h-5 w-5 text-green-500" />
													)}
													<span>{lecture?.title}</span>
												</Button>
											</div>
										)
									)}
								</div>
							</ScrollArea>
						</TabsContent>
						<TabsContent value="overview" className="flex-1 overflow-hidden">
							<ScrollArea className="h-full">
								<div className="p-4">
									<h2 className="text-xl font-bold mb-4">About this course</h2>
									<p className="text-gray-400">
										{studentCurrentCourseProgress?.courseDetails?.description}
									</p>
								</div>
							</ScrollArea>
						</TabsContent>
					</Tabs>
				</div>
			</div>
			<Dialog open={lockCourse}>
				<DialogContent className="sm:w-[425px]">
					<DialogHeader>
						<DialogTitle>You Can&apos;t View This Page</DialogTitle>
						<DialogDescription>
							Please purchase this course to access
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Dialog open={showCourseCompleteDialog}>
				<DialogContent showOverlay={false} className="sm:w-[425px]">
					<DialogHeader>
						<DialogTitle>Congrats, You Finished the Course!</DialogTitle>
						<DialogDescription className="flex flex-col gap-3">
							<Label>You have completed the course</Label>
							<span className="flex flex-row gap-3">
								<Button onClick={() => navigate("/student-courses")}>
									My Courses Page
								</Button>
								<Button onClick={handleReWatchCourse}>Rewatch Course</Button>
							</span>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};
