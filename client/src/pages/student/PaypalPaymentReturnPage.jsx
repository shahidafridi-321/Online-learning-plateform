import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const PaypalPaymentReturnPage = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);

	const paymentId = params.get("paymentId");
	const payerId = params.get("PayerID");
	useEffect(() => {
		if (paymentId && payerId) {
			const capturePayment = async () => {
				const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
				const response = captureAndFinalizePaymentService(
					paymentId,
					payerId,
					orderId
				);
				if (response.success) {
					sessionStorage.removeItem("currentOrderId");
					window.location.href = "/student-courses";
				}
			};
			capturePayment();
		}
	}, [paymentId, payerId]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Processing payment please wait ...</CardTitle>
			</CardHeader>
		</Card>
	);
};
