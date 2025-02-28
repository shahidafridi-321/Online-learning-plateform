import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, AlertCircle } from "lucide-react"; // Assuming Lucide icons are available
import { Button } from "@/components/ui/button"; // Assuming a Button component exists

export const PaypalPaymentReturnPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const params = new URLSearchParams(location.search);

	const paymentId = params.get("paymentId");
	const payerId = params.get("PayerID");
	const [paymentStatus, setPaymentStatus] = useState("processing");

	const capturePayment = async () => {
		try {
			const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
			const response = await captureAndFinalizePaymentService(
				paymentId,
				payerId,
				orderId
			);
			if (response.success) {
				sessionStorage.removeItem("currentOrderId");
				window.location.href = "/student-courses";
			} else {
				setPaymentStatus("failed");
			}
		} catch (error) {
			setPaymentStatus("failed");
		}
	};

	useEffect(() => {
		if (paymentId && payerId) {
			capturePayment();
		} else {
			setPaymentStatus("invalid");
		}
	}, [paymentId, payerId]);

	if (paymentStatus === "processing") {
		return (
			<Card className="max-w-md mx-auto p-4 sm:p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500" />
					</div>
					<CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
						Processing your payment...
					</CardTitle>
				</CardHeader>
				<div className="flex justify-center items-center mt-4">
					<div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500"></div>
				</div>
				<p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm sm:text-base">
					Please wait while we finalize your payment.
				</p>
			</Card>
		);
	} else if (paymentStatus === "failed") {
		return (
			<Card className="max-w-md mx-auto p-4 sm:p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
					</div>
					<CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
						Payment Failed
					</CardTitle>
				</CardHeader>
				<p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm sm:text-base">
					There was an issue processing your payment. Please try again or
					contact support.
				</p>
				<div className="mt-6 flex justify-center">
					<Button onClick={() => navigate("/checkout")}>Try Again</Button>
				</div>
			</Card>
		);
	} else if (paymentStatus === "invalid") {
		return (
			<Card className="max-w-md mx-auto p-4 sm:p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500" />
					</div>
					<CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
						Invalid Payment Details
					</CardTitle>
				</CardHeader>
				<p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm sm:text-base">
					The payment details are missing or invalid. Please return to the
					checkout page.
				</p>
				<div className="mt-6 flex justify-center">
					<Button onClick={() => navigate("/checkout")}>Go to Checkout</Button>
				</div>
			</Card>
		);
	}
};
