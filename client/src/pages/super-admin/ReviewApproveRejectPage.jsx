import { Button } from "@/components/ui/button";
import {
	approveReviewService,
	getAllReviews,
	rejectReviewService,
} from "@/services";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const ReviewApproveRejectPage = () => {
	const [testimonials, setTestimonials] = useState([]);

	const handleApproveReview = async (id) => {
		const response = await approveReviewService(id);
		if (response.success) {
			fetchReviews();
		}
	};

	const handleRejectReview = async (id) => {
		const response = await rejectReviewService(id);
		if (response.success) {
			fetchReviews();
		}
	};

	const fetchReviews = async () => {
		try {
			const response = await getAllReviews();
			if (response.success) {
				setTestimonials(response.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchReviews();
	}, []);

	return (
		<div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
					Review Approval Dashboard
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					{testimonials.filter((t) => !t.approved).length} reviews pending
					approval
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) =>
						!testimonial?.approved ? (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
							>
								<div className="flex items-center mb-4">
									<img
										src={testimonial.image}
										alt={testimonial.userName}
										className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-500 dark:border-indigo-400"
									/>
									<div>
										<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
											{testimonial.userName}
										</h4>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{testimonial.role}
										</p>
									</div>
								</div>
								<p className="text-gray-700 dark:text-gray-300 mb-6 italic">
									&quot;{testimonial.quote}&quot;
								</p>
								<div className="flex justify-end space-x-3">
									<Button
										onClick={() => handleApproveReview(testimonial?._id)}
										className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
									>
										Approve
									</Button>
									<Button
										onClick={() => handleRejectReview(testimonial?._id)}
										className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
									>
										Reject
									</Button>
								</div>
							</motion.div>
						) : null
					)}
				</div>
			</div>
		</div>
	);
};
