import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const MediaProgressBar = ({ isMediaUploading, progress }) => {
	const [showProgress, setshowProgress] = useState(false);
	const [animatedProgress, setAnimatedProgress] = useState(0);

	useEffect(() => {
		if (isMediaUploading) {
			setshowProgress(true);
			setAnimatedProgress(progress);
		} else {
			const timer = setTimeout(() => {
				setshowProgress(false);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [isMediaUploading, progress]);

	if (!showProgress) return null;

	return (
		<div className="w-full h-3 mt-5 mb-5 bg-gray-200 relative overflow-hidden rounded-full">
			<motion.div
				className="bg-blue-700 h-3 rounded-full"
				initial={{ width: 0 }}
				animate={{
					width: `${animatedProgress}%`,
					transition: { duration: 0.5, ease: "easeInOut" },
				}}
			>
				{progress >= 100 && isMediaUploading && (
					<motion.div
						className="absolute top-0 left-0 right-0 bottom-0 bg-blue-300 opacity-50"
						animate={{
							x: ["0%", "100%", "0%"],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "linear",
						}}
					/>
				)}
			</motion.div>
		</div>
	);
};
