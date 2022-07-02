const stripe = require("stripe")(process.env.STRIPE_API_KEY);

export default async function handler(req, res) {
	const { data } = await stripe.customers.list();

	const customer = data.find(d => d.email === req.body.email);

	if (!customer) return res.status(400).send({ cards: [] });

	const { data: cardList } = await stripe.customers.listPaymentMethods(
		customer.id,
		{
			type: "card"
		}
	);

	return res.status(200).json({ cards: cardList });
}
