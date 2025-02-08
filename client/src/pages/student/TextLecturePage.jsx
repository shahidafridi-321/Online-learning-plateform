import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/student-context/StudentContext";
import { fetchStudentViewCourseDetailsService } from "@/services";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Custom CodeBlock component with syntax highlighting and a copy button
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

export const TextLecturePage = () => {
	const {
		setStudentViewCourseDetails,
		currentCourseDetailsId,
		setCurrentCourseDetailsId,
		loading,
		setLoading,
	} = useContext(StudentContext);

	// Extract both courseId and lectureId from URL parameters
	const { courseId, lectureId } = useParams();
	console.log("Course ID:", courseId, "Lecture ID:", lectureId);

	const [lectureDetails, setLectureDetails] = useState(null);

	// Set the course ID in context
	useEffect(() => {
		if (courseId) {
			setCurrentCourseDetailsId(courseId);
		}
	}, [courseId, setCurrentCourseDetailsId]);

	// Fetch course details (and extract the text lecture) when currentCourseDetailsId changes
	useEffect(() => {
		if (currentCourseDetailsId) {
			fetchLectureDetails();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentCourseDetailsId, lectureId]);

	const fetchLectureDetails = async () => {
		setLoading(true);
		const response = await fetchStudentViewCourseDetailsService(
			currentCourseDetailsId
		);
		if (response?.success) {
			setStudentViewCourseDetails(response.data);
			// Find the specific text lecture using lectureId and type "text"
			const lecture = response.data.curriculum.find(
				(item) => item._id === lectureId && item.type === "text"
			);
			setLectureDetails(lecture);
		} else {
			setLectureDetails(null);
		}
		setLoading(false);
	};

	if (loading || !lectureDetails) {
		return <Skeleton />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6 text-white">
					{lectureDetails.title}
				</h1>
				<div className="markdown-body bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 bg-opacity-80 backdrop-blur-sm p-8 rounded-lg shadow-md my-4 text-base leading-relaxed">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{ code: CodeBlock }}
						className="text-gray-800"
					>
						{lectureDetails.textContent}
					</ReactMarkdown>
				</div>
			</div>
		</div>
	);
};
