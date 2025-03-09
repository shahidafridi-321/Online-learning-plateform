import React, { useState, useEffect, useCallback } from "react";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BannerImage from "../../../public/course8.webp";
import {
	AcademicCapIcon,
	BookOpenIcon,
	LightBulbIcon,
} from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// Constants for animation variants
const textVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0 },
};

const iconVariants = {
	float: {
		y: [0, -10, 0],
		transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
	},
};

export const HeroSection = () => {
	const [headingComplete, setHeadingComplete] = useState(false);
	const [hasTyped, setHasTyped] = useState(false);
	const [imageError, setImageError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	// Memoized function to check localStorage
	const checkTypingStatus = useCallback(() => {
		try {
			const typed = localStorage.getItem("heroTyped");
			if (typed === "true") {
				setHasTyped(true);
				setHeadingComplete(true);
			}
		} catch (error) {
			console.warn("LocalStorage access failed:", error);
			setHasTyped(false);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		checkTypingStatus();
	}, [checkTypingStatus]);

	// Handle typewriter completion
	const handleTypewriterComplete = useCallback(() => {
		setHeadingComplete(true);
		try {
			localStorage.setItem("heroTyped", "true");
			setHasTyped(true);
		} catch (error) {
			console.warn("Failed to set localStorage:", error);
		}
	}, []);

	// Render heading with typewriter or static text
	const renderHeading = () => {
		if (!hasTyped) {
			return (
				<Typewriter
					options={{
						autoStart: true,
						loop: false,
						delay: 75,
						cursor: "",
					}}
					onInit={(typewriter) => {
						typewriter
							.typeString("Empower Your Future, One Course at a Time")
							.callFunction(handleTypewriterComplete)
							.start();
					}}
				/>
			);
		}
		return "Empower Your Future, One Course at a Time";
	};

	// Handle image load error
	const handleImageError = () => {
		setImageError(true);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
				<Loader2 className="w-10 h-10 text-white animate-spin" />
			</div>
		);
	}

	return (
		<section
			className="flex flex-col min-h-screen lg:flex-row items-center justify-between py-12 lg:py-0 px-4 lg:pl-12 lg:pr-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 rounded-b-lg shadow-lg overflow-hidden"
			role="banner"
			aria-label="Hero Section"
		>
			{/* Text Content of hero section*/}
			<div className="lg:w-1/2 text-center lg:text-left relative z-10">
				{/* Floating Icons */}
				<motion.div
					className="absolute -top-10 -left-10 text-white hidden lg:block"
					variants={iconVariants}
					animate="float"
					aria-hidden="true"
				>
					<AcademicCapIcon className="w-10 h-10 opacity-50" />
				</motion.div>
				<motion.div
					className="absolute bottom-0 -left-12 text-white hidden lg:block"
					variants={iconVariants}
					animate="float"
					transition={{ duration: 4, delay: 0.5 }}
					aria-hidden="true"
				>
					<BookOpenIcon className="w-12 h-12 opacity-50" />
				</motion.div>
				<motion.div
					className="absolute bottom-10 right-0 text-white hidden lg:block"
					variants={iconVariants}
					animate="float"
					transition={{ duration: 3.5, delay: 1 }}
					aria-hidden="true"
				>
					<LightBulbIcon className="w-8 h-8 opacity-50" />
				</motion.div>

				<h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
					{renderHeading()}
				</h1>

				{headingComplete && (
					<motion.p
						className="text-lg sm:text-xl text-white mb-8 tracking-wide leading-relaxed max-w-xl mx-auto lg:mx-0"
						variants={textVariants}
						initial="hidden"
						animate="visible"
						transition={{ delay: 0.5 }}
					>
						Dive into a world of knowledge where innovative courses and expert
						guidance transform your potential into success. Discover, learn, and
						thrive with the skills you need for tomorrow.
					</motion.p>
				)}

				{/* Call to Action */}
				{headingComplete && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1 }}
						whileHover={{ scale: 1.05 }}
						className="flex justify-center lg:justify-start"
					>
						<Button
							onClick={() => navigate("/courses")}
							className="bg-white text-blue-600 dark:bg-indigo-800 dark:text-white hover:bg-gray-100 dark:hover:bg-indigo-700 px-8 py-4 font-semibold rounded-full shadow-lg flex items-center transition-colors duration-300"
							aria-label="Get Started with Courses"
						>
							Get Started
							<svg
								className="ml-2 w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
						</Button>
					</motion.div>
				)}
			</div>

			{/* Image */}
			<div className="flex-1 mt-8 lg:mt-0 flex justify-center items-center relative z-0">
				{imageError ? (
					<div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
						<p className="text-white text-lg">Image Failed to Load</p>
					</div>
				) : (
					<motion.img
						src={BannerImage}
						alt="Explore Courses Banner"
						className="w-full max-w-md lg:max-w-full shadow-2xl rounded-lg object-cover"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						onError={handleImageError}
						loading="lazy"
					/>
				)}
			</div>
		</section>
	);
};
