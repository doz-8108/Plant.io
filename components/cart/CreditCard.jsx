import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CircularProgress, Slide, useMediaQuery } from "@mui/material";
import { LocationMarkerIcon, PencilAltIcon } from "@heroicons/react/solid";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useUser } from "@auth0/nextjs-auth0";

import CheckoutForm from "./CheckoutForm";
import { TextButton } from "../shared/Buttons";
import { useEffect } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_ELEMENT_KEY);

const Payment = ({ contact, setPaymentProcessing, products }) => {
	const { user } = useUser();
	const router = useRouter();
	const isPortrait = useMediaQuery("(max-width: 1024px)");

	const [paymentIntent, setPaymentIntent] = useState(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (!products.length || !contact || !user) return;

		setLoading(true);
		fetch("/api/payment/createPaymentIntent", {
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				products: products.map(({ _id, name, price, qty }) => ({
					_id,
					name,
					price,
					qty
				})),
				email: user.email
			}),
			method: "POST"
		})
			.then(data => data.json())
			.then(intent => setPaymentIntent(intent))
			.finally(() => setLoading(false));
	}, [products, user]);

	return (
		<Slide direction="left" mountOnEnter unmountOnExit in={true}>
			<div className="flex flex-col">
				<div className="border-solid rounded-md shadow-md flex overflow-hidden min-h-[180px]">
					<div className="flex flex-col basis-1/3 bg-color-primary-light text-white justify-center items-center">
						<LocationMarkerIcon className="w-12 h-12" />
						<p className="text-center px-2 text-sm tracking-widest mt-3 mb-2">
							YOUR LOCATION
						</p>
						<hr className="block border-solid border-white border-2 w-[30%] justify-self-center" />
					</div>
					<div className="flex-1 px-[5%] py-5 text-sm text-color-secondary-light font-monsterrat tracking-wider leading-7 relative break-all">
						{contact ? (
							<>
								<Link href="/user/summary">
									<a
										className="absolute right-2 top-2"
										aria-label="edit address"
										title="edit address"
									>
										<PencilAltIcon className="w-5 h-5" />
									</a>
								</Link>
								<p className="tracking-widest text-base sm:text-xl mb-1 text-color-secondary">{`${contact.firstName} ${contact.lastName}`}</p>
								<p>
									{contact.address} {contact.district}
								</p>
								<p>{contact.phone}</p>
								<p className="mt-3 mb-1">{contact.instructions}</p>
							</>
						) : (
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<p className="text-center tracking-widest text-xl">
									No address found
								</p>
								<Link href="/user/summary">
									<a>
										<TextButton
											text="Create One"
											custom={{
												display: "block",
												margin: "0 auto",
												padding: "0",
												marginTop: ".75rem"
											}}
										/>
									</a>
								</Link>
							</div>
						)}
					</div>
				</div>
				{((paymentIntent && products.length) || isLoading) && (
					<div className="mt-10 w-full p-5 rounded-md shadow-md relative min-h-[100px]">
						{isLoading ? (
							<CircularProgress
								sx={{
									color: "var(--color-primary)",
									position: "absolute",
									left: "50%"
								}}
							/>
						) : (
							<Elements
								options={{
									clientSecret: paymentIntent.client_secret,
									appearance: { theme: "stripe" }
								}}
								stripe={stripePromise}
							>
								<CheckoutForm
									setPaymentProcessing={setPaymentProcessing}
									paymentIntent={paymentIntent}
									contact={contact}
								/>
							</Elements>
						)}
					</div>
				)}
				{isPortrait && (
					<TextButton
						custom={{ margin: "2.5rem 0" }}
						event={() =>
							router.push({
								pathname: router.pathname,
								query: { section: "cart-summary" }
							})
						}
						text="&larr; Back"
					/>
				)}
			</div>
		</Slide>
	);
};

export default Payment;
