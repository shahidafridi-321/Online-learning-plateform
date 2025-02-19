const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const StudentCourses = require("../../models/StudentCourses");

const Course = require("../../models/Course");

const createOrder = async (req, res) => {
	try {
		const {
			userId,
			userName,
			userEmail,
			orderStatus,
			paymentMethod,
			paymentStatus,
			PaymentId,
			orderDate,
			payerId,
			instructorId,
			instructorName,
			courseImage,
			courseTitle,
			courseId,
			coursePricing,
		} = req.body;

		const create_payment_json = {
			intent: "sale",
			payer: {
				payment_method: "paypal",
			},
			redirect_urls: {
				return_url: `${process.env.CLIENT_URL}/payment-return`,
				cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
			},
			transictions: [
				{
					item_list: {
						items: [
							{
								name: courseTitle,
								sku: courseId,
								price: coursePricing,
								currency: "USD",
								quantity: 1,
							},
						],
					},
					amount: {
						currency: "USD",
						total: coursePricing.toFixed(2),
					},
					description: courseTitle,
				},
			],
		};

		paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
			if (error) {
				console.log(error);
				return res.status(500).json({
					success: false,
					message: "Error While Creating Payment!",
				});
			} else {
				const newlyCreatedOrder = new Order({
					userId,
					userName,
					userEmail,
					orderStatus,
					paymentMethod,
					paymentStatus,
					PaymentId,
					orderDate,
					payerId,
					instructorId,
					instructorName,
					courseImage,
					courseTitle,
					courseId,
					coursePricing,
				});
				await newlyCreatedOrder.save();
				const approveUrl = paymentInfo.links.find(
					(link) => link.rel == "approval_url"
				).href;

				res.status(201).json({
					success: true,
					data: {
						approveUrl,
						orderId: newlyCreatedOrder._id,
					},
				});
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Payment was unsuccessful!",
		});
	}
};
