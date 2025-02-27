import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BannerImage from "../../../public/hero-img.jpg";
import {
	AcademicCapIcon,
	BookOpenIcon,
	LightBulbIcon,
} from "@heroicons/react/24/outline";

export const HeroSection = () => {
	// State for typewriter effect
	const [headingComplete, setHeadingComplete] = useState(false);
	const [hasTyped, setHasTyped] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem("heroTyped") === "true") {
			setHasTyped(true);
			setHeadingComplete(true);
		}
	}, []);

	const renderHeading = () => {
		if (!hasTyped) {
			return (
				<Typewriter
					options={{
						autoStart: true,
						loop: false,
						delay: 75,
					}}
					onInit={(typewriter) => {
						typewriter
							.typeString("Empower Your Future, One Course at a Time")
							.callFunction(() => {
								setHeadingComplete(true);
								localStorage.setItem("heroTyped", "true");
								setHasTyped(true);
							})
							.start();
					}}
				/>
			);
		} else {
			return "Empower Your Future, One Course at a Time";
		}
	};

	return (
		<section
			className="flex flex-col lg:flex-row items-center justify-between 
                 py-12 px-4 lg:px-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 rounded-b-lg shadow-lg"
		>
			<div className="lg:w-1/2 text-center lg:text-left relative">
				{/* Floating Icons */}
				<motion.div
					className="absolute -top-10 -left-10 text-white hidden lg:block"
					animate={{ y: [0, -10, 0] }}
					transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
				>
					<AcademicCapIcon className="w-10 h-10 opacity-50" />
				</motion.div>
				<motion.div
					className="absolute bottom-0 -left-12 text-white hidden lg:block"
					animate={{ y: [0, -10, 0] }}
					transition={{
						repeat: Infinity,
						duration: 4,
						ease: "easeInOut",
						delay: 0.5,
					}}
				>
					<BookOpenIcon className="w-12 h-12 opacity-50" />
				</motion.div>
				<motion.div
					className="absolute bottom-10 right-0 text-white hidden lg:block"
					animate={{ y: [0, -10, 0] }}
					transition={{
						repeat: Infinity,
						duration: 3.5,
						ease: "easeInOut",
						delay: 1,
					}}
				>
					<LightBulbIcon className="w-8 h-8 opacity-50" />
				</motion.div>

				{/* Text Content */}
				<div className="text-5xl font-extrabold text-white mb-6">
					{renderHeading()}
				</div>
				{headingComplete && (
					<motion.p
						className="text-xl text-white mb-8 tracking-wide leading-relaxed"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						Dive into a world of knowledge where innovative courses and expert
						guidance transform your potential into success. Discover, learn, and
						thrive with the skills you need for tomorrow.
					</motion.p>
				)}
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
							className="bg-white text-blue-600 dark:bg-indigo-800 dark:text-white 
                         hover:bg-gray-100 dark:hover:bg-indigo-700 px-8 py-4 font-semibold 
                         rounded-full shadow-lg flex items-center"
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
			<div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
				<motion.img
					src={BannerImage}
					alt="Banner"
					className="w-full max-w-sm rounded-lg shadow-2xl border-4 border-white"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				/>
			</div>
		</section>
	);
};
