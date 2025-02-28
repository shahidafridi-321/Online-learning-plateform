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

module.exports = { createReview, getAllReviews };
