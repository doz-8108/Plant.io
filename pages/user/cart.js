import React, { useState } from "react";
import { useRouter } from "next/router";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";

import client from "../../utils/sanity.client";
import CreditCard from "../../components/cart/CreditCard";
import Summary from "../../components/cart/BillingSummary";
import SubHeader from "../../components/shared/SubHeader";
import useCart from "../../hooks/useCart";

const Cart = ({ contact }) => {
	const router = useRouter();
	const isPortrait = useMediaQuery("(max-width: 1024px)");
	const [isPaymentProcessing, setPaymentProcessing] = useState(false);
	const cart = useCart();

	// default tab
	let section = router.query.section;
	if (isPortrait && !section) section = "cart-summary";

	const displaySummry =
		(isPortrait && section === "cart-summary") || !isPortrait;
	const displayBilling =
		(isPortrait && section === "cart-billing") || !isPortrait;

	return (
		<div className="mt-4 px-[5vw] xl:px-[8vw] relative">
			<SubHeader title="Shopping Cart" />
			{isPaymentProcessing && (
				<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-999 bg-white h-[100vh] w-full">
					<CircularProgress
						sx={{
							color: "var(--color-primary)",
							marginBottom: "15px"
						}}
					/>
					<p className="text-center">Processing your payment...</p>
				</div>
			)}
			<div className="md:w-full md:grid md:grid-cols-1 lg:grid-cols-cart md:h-96 md:m-0 md:gap-x-8">
				{displaySummry && <Summary {...cart} products={cart.items} />}
				{displayBilling && (
					<CreditCard
						products={cart.items}
						contact={contact}
						setPaymentProcessing={setPaymentProcessing}
					/>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const { user } = getSession(req, res);
		const userId = user.sub.split("|")[1];

		const contact = await client.getUserContact(userId);

		return {
			props: {
				contact: contact.length ? contact[0] : null
			}
		};
	}
});

export default Cart;
