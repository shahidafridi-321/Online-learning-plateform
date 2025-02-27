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
					className="absolute right-2 top-2 z-10 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded px-2 py-1 text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
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

		loading,
		setLoading,
	} = useContext(StudentContext);

	// Extract courseId and lectureId from URL parameters
	const { courseId, lectureId } = useParams();
	const [lectureDetails, setLectureDetails] = useState(null);

	// Fetch course details and extract lecture when courseId or lectureId changes
	useEffect(() => {
		if (courseId) {
			fetchLectureDetails();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [courseId, lectureId]);

	const fetchLectureDetails = async () => {
		setLoading(true);
		const response = await fetchStudentViewCourseDetailsService(courseId);
		if (response?.success) {
			setStudentViewCourseDetails(response.data);
			// Find the specific text lecture with matching lectureId and type "text"
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
		<div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-8">
			<div className="max-w-4xl mx-auto">
				{/* Lecture Header */}
				<div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 p-6 shadow-lg">
					<h1 className="text-4xl font-bold text-white">
						{lectureDetails.title}
					</h1>
				</div>
				{/* Lecture Content */}
				<div className="markdown-body bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 backdrop-blur-sm p-8 rounded-lg shadow-lg my-4 text-base leading-relaxed text-gray-800 dark:text-gray-100">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							code({ node, inline, className, children, ...props }) {
								return inline ? (
									<code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
										{children}
									</code>
								) : (
									<CodeBlock className={className} {...props}>
										{children}
									</CodeBlock>
								);
							},
						}}
					>
						{lectureDetails.textContent}
					</ReactMarkdown>
				</div>
			</div>
		</div>
	);
};
