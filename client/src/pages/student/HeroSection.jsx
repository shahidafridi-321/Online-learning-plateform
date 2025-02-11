import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BannerImage from "../../../public/hero-img.jpg";

export const HeroSection = () => {
	// This state tracks whether the typing effect is complete
	const [headingComplete, setHeadingComplete] = useState(false);
	// This state tracks if the typewriter effect has already run
	const [hasTyped, setHasTyped] = useState(false);
	const navigate = useNavigate();

	// Check localStorage on mount to see if we've already typed the heading
	useEffect(() => {
		if (localStorage.getItem("heroTyped") === "true") {
			setHasTyped(true);
			setHeadingComplete(true);
		}
	}, []);

	// Function to render the heading text: animated if not typed before, else static
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
		<section className="flex flex-col lg:flex-row items-center justify-between py-12 px-4 lg:px-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg shadow-lg">
			<div className="lg:w-1/2 text-center lg:text-left">
				<div className="text-5xl font-extrabold text-white mb-6">
					{renderHeading()}
				</div>

				{headingComplete && (
					<motion.p
						className="text-xl text-white mb-8"
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
					>
						<Button
							onClick={() => navigate("/courses")}
							className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-semibold rounded-full shadow-lg"
						>
							Get Started
						</Button>
					</motion.div>
				)}
			</div>

			<div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
				<img
					src={BannerImage}
					alt="Banner"
					className="w-96 h-auto rounded-lg shadow-2xl"
				/>
			</div>
		</section>
	);
};
