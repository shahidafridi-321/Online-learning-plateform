import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactConfetti from "react-confetti";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
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
	Copy,
	LockIcon,
} from "lucide-react";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context/StudentContext";
import {
	getCurrentCourseProgressService,
	markLectureAsViewedService,
	resetCourseProgressService,
} from "@/services";

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
			<code
				className={`${className} bg-gray-700 px-1.5 py-0.5 rounded`}
				{...props}
			>
				{children}
			</code>
		);
	}

	return (
		<div className="relative my-6 group">
			<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity" />
			<div className="relative">
				<button
					onClick={copyToClipboard}
					className="absolute right-3 top-3 z-10 flex items-center gap-1.5 bg-gray-800/80 text-gray-300 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-700/80 transition-colors"
				>
					{copied ? (
						<CircleCheckBigIcon className="h-4 w-4 text-green-400" />
					) : (
						<Copy className="h-4 w-4" />
					)}
				</button>
				<SyntaxHighlighter
					language={match?.[1] || ""}
					style={oneDark}
					showLineNumbers
					customStyle={{
						borderRadius: "0.75rem",
						padding: "1.5rem",
						background: "#1E1E1E",
					}}
					{...props}
				>
					{code}
				</SyntaxHighlighter>
			</div>
		</div>
	);
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
			await fetchCurrentCourseProgress();
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
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
			{showConfetti && (
				<ReactConfetti
					numberOfPieces={300}
					recycle={false}
					colors={["#6366F1", "#8B5CF6", "#EC4899", "#3B82F6"]}
					className="w-full h-full"
				/>
			)}

			<header className="sticky top-0 z-50 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button
							onClick={() => navigate("/student-courses")}
							variant="ghost"
							className="text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors rounded-lg"
						>
							<ChevronLeft className="h-5 w-5 mr-2" />
							<span className="hidden sm:inline">My Courses</span>
						</Button>
						<h1 className="text-xl font-bold truncate max-w-[400px] bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
							{studentCurrentCourseProgress?.courseDetails?.title}
						</h1>
					</div>

					<Button
						onClick={() => setIsSideBarOpen(!isSideBarOpen)}
						variant="ghost"
						className="text-gray-300 hover:bg-gray-700/50 rounded-lg"
					>
						{isSideBarOpen ? (
							<ChevronRight className="w-6 h-6" />
						) : (
							<ChevronLeft className="w-6 h-6" />
						)}
					</Button>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 transition-all duration-300">
				<section className="flex-1 space-y-8">
					{currentLecture?.type === "video" ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="rounded-2xl overflow-hidden shadow-2xl bg-gray-800"
						>
							<VideoPlayer
								key={currentLecture._id}
								width="100%"
								height="500px"
								url={currentLecture?.videoUrl}
								onEnded={handleVideoEnded}
							/>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="markdown-body bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700"
						>
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{ code: CodeBlock }}
								className="prose prose-invert max-w-none"
							>
								{currentLecture?.textContent}
							</ReactMarkdown>
							<Button
								onClick={updateCourseProgress}
								className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg py-6 text-lg"
							>
								Mark as Completed
							</Button>
						</motion.div>
					)}

					{currentLecture && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
						>
							<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
								{currentLecture?.title}
							</h2>
						</motion.div>
					)}
				</section>

				<motion.aside
					animate={{ width: isSideBarOpen ? 400 : 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="h-[calc(100vh-140px)] overflow-hidden  border-gray-700 rounded-2xl ml-2"
				>
					{isSideBarOpen && (
						<div className="w-[400px] h-full bg-gray-800/90 backdrop-blur-xl p-6">
							<Tabs
								defaultValue="content"
								className="h-full flex flex-col gap-4"
							>
								<TabsList className="bg-gray-900/50 rounded-lg p-1">
									<TabsTrigger
										value="content"
										className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-3 rounded-md text-gray-300 hover:text-white transition-colors flex-1"
									>
										Content
									</TabsTrigger>
									<TabsTrigger
										value="overview"
										className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-3 rounded-md text-gray-300 hover:text-white transition-colors flex-1"
									>
										Overview
									</TabsTrigger>
								</TabsList>

								<TabsContent value="content" className="flex-1 overflow-hidden">
									<ScrollArea className="h-full pr-4">
										<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
											Course Content
										</h2>
										<div className="space-y-2">
											{studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
												(lecture) => (
													<motion.div
														key={lecture?._id}
														initial={{ opacity: 0, x: 20 }}
														animate={{ opacity: 1, x: 0 }}
														className={`group flex items-center p-3 rounded-lg transition-colors ${
															currentLecture?._id === lecture?._id
																? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50"
																: "hover:bg-gray-700/30"
														}`}
													>
														<Button
															variant="ghost"
															onClick={() => handleLectureChange(lecture?._id)}
															className="w-full justify-start gap-3 hover:bg-transparent"
														>
															{studentCurrentCourseProgress?.progress?.find(
																(p) => p.lectureId === lecture?._id
															)?.viewed ? (
																<CircleCheckBigIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
															) : (
																<Circle className="h-5 w-5 text-gray-500 flex-shrink-0" />
															)}
															<span className="text-left text-gray-200 group-hover:text-white transition-colors">
																{lecture?.title}
															</span>
														</Button>
													</motion.div>
												)
											)}
										</div>
									</ScrollArea>
								</TabsContent>

								<TabsContent
									value="overview"
									className="flex-1 overflow-hidden"
								>
									<ScrollArea className="h-full pr-4">
										<div className="space-y-6">
											<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
												Course Overview
											</h2>
											<p className="text-gray-300 leading-relaxed">
												{
													studentCurrentCourseProgress?.courseDetails
														?.description
												}
											</p>
										</div>
									</ScrollArea>
								</TabsContent>
							</Tabs>
						</div>
					)}
				</motion.aside>
			</main>

			<Dialog open={lockCourse}>
				<DialogContent className="bg-gray-800 border-gray-700 rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
							Course Locked 🔒
						</DialogTitle>
						<DialogDescription className="text-gray-300 mt-4 text-center">
							<LockIcon className="h-16 w-16 mx-auto text-purple-400 mb-4" />
							Purchase this course to unlock premium content
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<Dialog open={showCourseCompleteDialog}>
				<DialogContent className="bg-gradient-to-br from-purple-900 to-gray-900 border-gray-700 rounded-2xl">
					<DialogHeader>
						<DialogTitle className="text-3xl font-bold text-center mb-6">
							🎉 Course Completed!
						</DialogTitle>
						<div className="flex flex-col items-center gap-4">
							<Button
								onClick={() => navigate("/student-courses")}
								className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 rounded-xl text-lg"
							>
								View My Courses
							</Button>
							<Button
								onClick={handleReWatchCourse}
								className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 rounded-xl text-lg"
							>
								Rewatch Course
							</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};
