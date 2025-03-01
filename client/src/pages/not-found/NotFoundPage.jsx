import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center"
			>
				<AlertCircle
					className="mx-auto h-16 w-16 text-red-400 mb-4"
					aria-hidden="true"
				/>
				<h1 className="text-4xl font-bold text-white mb-4">
					404 - Page Not Found
				</h1>
				<p className="text-xl text-gray-300 mb-8">
					Oops! The page you&apos;re looking for doesn&apos;t exist.
				</p>
				<Button
					onClick={() => navigate("/")}
					className="bg-indigo-600 hover:bg-indigo-700 text-white"
				>
					Go Home
				</Button>
			</motion.div>
		</div>
	);
};
