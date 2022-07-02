const stripe = require("stripe")(process.env.STRIPE_API_KEY);

export default async function handler(req, res) {
	if (!req.body.cardId)
		return res.status(400).json({
			status: "error",
			message: "No id of payment method is provided"
		});

	await stripe.paymentMethods.detach(req.body.cardId);

	return res.status(200).json({
		status: "success",
		message: "Detach a payment method from customer"
	});
}
