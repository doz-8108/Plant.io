import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import client from "../../utils/sanity.client";
import Contact from "../../components/User/Customer/Contact";
import Container from "../../components/User/Container";
import CardList from "../../components/User/Customer/CardList";
import SubHeader from "../../components/shared/SubHeader";

const contact = ({ paymentMethods, contact, userId }) => {
	return (
		<Container>
			<div className="flex flex-col lg:flex-row">
				<div>
					<SubHeader title="Summary" />
					<Contact contact={contact} userId={userId} />
				</div>
				<CardList paymentMethods={paymentMethods} />
			</div>
		</Container>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const { user } = getSession(req, res);
		const userId = user.sub.split("|")[1];

		const contact = await client.getUserContact(userId);
		const { cards } = await (
			await fetch(`http://${req.headers.host}/api/payment/retrieveUserCards`, {
				headers: {
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify({
					email: user.email
				})
			})
		).json();

		const paymentMethods = cards.map(
			({ id, card: { brand, last4, exp_month, exp_year } }) => ({
				brand,
				last4,
				exp_month,
				exp_year,
				id
			})
		);

		return {
			props: {
				contact: contact.length
					? { ...contact[0], district: contact[0].district[0] }
					: null,
				userId,
				paymentMethods
			}
		};
	}
});

export default contact;
