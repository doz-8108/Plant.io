const stripe = require("stripe")(process.env.STRIPE_API_KEY);

export default async function handler(req, res) {
	const { products, email } = req.body;

	let customer;

	const { data } = await stripe.customers.list();
	customer = data.find(d => d.email === email);

	customer =
		customer ||
		(await stripe.customers.create({
			email
		}));

	const paymentIntent = await stripe.paymentIntents.create({
		customer: customer.id,
		currency: "hkd",
		amount: 1000,
		payment_method_types: ["card"],
		metadata: {
			products: JSON.stringify(products)
		}
	});

	return res.status(200).json(paymentIntent);
}
