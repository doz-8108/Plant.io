import React, { useEffect, useState } from "react";
import {
	PaymentElement,
	useStripe,
	useElements
} from "@stripe/react-stripe-js";
import { v4 } from "uuid";
import { useUser } from "@auth0/nextjs-auth0";
import { Alert } from "@mui/material";

import useCart from "../../hooks/useCart";
import client from "../../utils/sanity.client";
import { ButtonPrimary } from "../shared/Buttons";

const CheckoutForm = ({ setPaymentProcessing }) => {
	const stripe = useStripe();
	const elements = useElements();
	const { user } = useUser();
	const { items } = useCart();

	const [message, setMessage] = useState(null);

	useEffect(() => {
		if (!stripe) {
			return;
		}

		const clientSecret = new URLSearchParams(window.location.search).get(
			"payment_intent_client_secret"
		);

		if (!clientSecret) return;

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
				case "succeeded":
					setMessage("Payment succeeded!");
					break;
				case "processing":
					setMessage("Your payment is processing.");
					break;
				case "requires_payment_method":
					setMessage("Your payment was not successful, please try again.");
					break;
				default:
					setMessage("Something went wrong.");
					break;
			}
		});
	}, [stripe]);

	const handleSubmit = async e => {
		e.preventDefault();

		if (!stripe || !elements) return;

		setPaymentProcessing(true);

		const { _id: orderId } = await client.createOrder(
			items.map(({ qty, _id, price }) => ({
				_key: v4(),
				quantity: qty,
				product: {
					_ref: _id,
					_type: "reference"
				},
				price
			})),
			{
				_ref: user.sub.split("|")[1],
				_type: "reference"
			}
		);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				save_payment_method: true,
				// Make sure to change this to your payment completion page
				return_url: `http://plant-io.pakpannn.com/order/${orderId}`
			}
		});

		if (error.type === "card_error" || error.type === "validation_error") {
			setMessage(error.message);
		} else {
			setMessage("An unexpected error occured.");
		}

		// will reach here if did not perform rediection (payment failed)
		await client.cancelOrder(orderId);

		setPaymentProcessing(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<ButtonPrimary
				custom={{
					marginTop: "2.5rem",
					justifySelf: "center",
					display: "block",
					width: "100%"
				}}
				disabled={!stripe || !elements}
				text={<span>Pay now</span>}
			></ButtonPrimary>
			{/* Show any error or success messages */}
			{message && (
				<Alert className="px-2 py-1 mt-3" severity="error">
					{message}
				</Alert>
			)}
		</form>
	);
};

export default CheckoutForm;
