import React, { useEffect } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { getSession } from "@auth0/nextjs-auth0";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import client from "../../utils/sanity.client";
import { TextButton } from "../../components/shared/Buttons";

const Order = ({ orderId, date, total }) => {
	useEffect(() => {
		localStorage.removeItem("cart");
	}, []);

	return (
		<div className="pt-14 text-center">
			<div className="flex items-center justify-center">
				<CheckCircleIcon className="h-10 w-10 mr-2 text-color-primary-light" />
				<h2 className="text-xl font-bold text-color-secondary">
					We have received your order!
				</h2>
			</div>
			<div className="w-[300px] mx-auto pt-5 text-color-secondary-light">
				<div className="flex justify-between">
					<span>ID:</span>
					<span>{orderId}</span>
				</div>
				<div className="flex justify-between">
					<span>Ordered at:</span>
					<span>{date}</span>
				</div>
				<div className="flex justify-between">
					<span>Total:</span>
					<span>${total}</span>
				</div>
				<Link href="/user/orders">
					<a>
						<TextButton text={"View Detail"} custom={{ marginTop: "4rem" }} />
					</a>
				</Link>
			</div>
		</div>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx) {
		const { req, res, params } = ctx;
		const { oid: orderId } = params;

		const { user } = getSession(req, res);
		const userId = user.sub.split("|")[1];

		const order = (await client.getOrder(orderId))[0];

		if (!order || (order && order.user._ref !== userId)) {
			return {
				redirect: {
					permanent: false,
					destination: "/"
				}
			};
		}

		const total = order.products.reduce(
			(prev, p) => prev + p.quantity * p.price,
			0
		);

		return {
			props: {
				orderId,
				total,
				date: order.date
			}
		};
	}
});

export default Order;
