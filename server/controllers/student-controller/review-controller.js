const Reviews = require("../../models/Reviews");

const createReview = async (req, res) => {
	try {
		const { userName, role, image, quote } = req.body;
		const newReview = new Reviews({
			userName,
			role,
			image,
			quote,
			date: new Date(),
			approved: false,
		});
		await newReview.save();
		res.status(200).json({
			success: true,
			message: "Review Submitted Successfully!",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: "Some error occured while reviewing!",
		});
	}
};
const getLatestReviews = async (req, res) => {
	try {
		const latestReviews = await Reviews.find({ approved: true })
			.sort({ date: -1 })
			.limit(4);
		if (!latestReviews || latestReviews.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No Approved Reviews Found!",
			});
		}
		res.status(200).json({
			success: true,
			data: latestReviews,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: "Something went wrong, cannot fetch reviews",
		});
	}
};

const getAllReviews = async (req, res) => {
	try {
		const reviews = await Reviews.find({});
		if (!reviews) {
			return res.status(404).json({
				success: false,
				message: "No Reviews Found!",
			});
		}
		res.status(200).json({
			success: true,
			message: "Reviews Retrieved Successfully!",
			data: reviews,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: "Some Error Occured While Retrieving Reviews!",
		});
	}
};

const approveReview = async (req, res) => {
	const { id } = req.params;
	try {
		const review = await Reviews.findById(id);
		if (!review) {
			return res.status(404).json({
				success: false,
				message: "No review found",
			});
		}

		if (review.approved) {
			return res.status(500).json({
				success: false,
				message: "Review already approved!",
			});
		}
		review.approved = true;
		review.save();
		res.status(200).json({
			success: true,
			message: "Review approved successfully!",
			data: review,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: "SomeThing went wrong , could not find review!",
		});
	}
};

const deleteReview = async (req, res) => {
	const { id } = req.params;
	try {
		const isReviewPresent = await Reviews.findById(id);
		if (!isReviewPresent) {
			return res.status(404).json({
				success: false,
				message: "No review found",
			});
		}
		await Reviews.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			message: "Review Rejection successful",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: "SomeThing went wrong , could not find review!",
		});
	}
};

module.exports = {
	createReview,
	getAllReviews,
	approveReview,
	deleteReview,
	getLatestReviews,
};
