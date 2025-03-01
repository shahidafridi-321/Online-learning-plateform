import { Button } from "@/components/ui/button";
import { approveReviewService, getAllReviews } from "@/services";
import React, { useEffect, useState } from "react";

export const ReviewApproveRejectPage = () => {
	const [testimonials, setTestimonials] = useState([]);

	const handleApproveReview = async (id) => {
		const response = await approveReviewService(id);
		console.log(response);
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
	console.log(testimonials[0]);

	return (
		<div className="h-screen flex flex-col  mx-auto px-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{testimonials.map((testimonial, index) =>
					!testimonial?.approved ? (
						<div
							key={index}
							className="bg-white dark:bg-gray-900 p-6 rounded-xl flex flex-col space-y-5  justify-center shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
						>
							<p className="text-gray-600 dark:text-gray-300 mb-4 italic">
								&quot;{testimonial.quote}&quot;
							</p>
							<div className="flex items-center">
								<img
									src={testimonial.image}
									alt={testimonial.userName}
									className="w-14 h-14 rounded-full mr-4 border-2 border-indigo-600 dark:border-indigo-400"
								/>
								<div>
									<h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
										{testimonial.userName}
									</h4>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{testimonial.role}
									</p>
								</div>
							</div>
							<div className="flex space-x-3">
								<Button onClick={() => handleApproveReview(testimonial?._id)}>
									Approve
								</Button>
							</div>
						</div>
					) : null
				)}
			</div>
		</div>
	);
};
