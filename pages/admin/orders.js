import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import client from "../../utils/sanity.client";
import checkPermission from "../../utils/checkPermission";
import ListCollapsible from "../../components/shared/ListCollapsible";
import Container from "../../components/user/Container";
import SubHeader from "../../components/shared/SubHeader";

const headers = ["Order ID", "Customer ID", "Customer", "Ordered At"];
const CollapsibleContent = ({
	_id,
	products,
	address,
	phone,
	user,
	status
}) => {
	const statusOptions = ["preparing", "shipping", "complete", "cancelled"];
	const statusIconState = {
		preparing: "receipt text-yellow-400 ml-2 mr-1",
		shipping: "shipping-fast text-yellow-500 ml-2 mr-1",
		complete: "check-circle text-green-500 ml-2 mr-1",
		cancelled: "times-circle text-red-500 ml-2 mr-1"
	};

	const [currOption, setOption] = useState(status);
	const handleStatusChange = async e => {
		setOption(e.target.value);
		client.updateOrder(_id, e.target.value);
	};

	return (
		<div className="text-base py-2">
			<div className="text-right">
				<i className={`fas fa-${statusIconState[currOption]} text-base`}></i>
				<select value={currOption} onChange={handleStatusChange}>
					{statusOptions.map(s => (
						<option key={s} value={s} className="text-color-secondary-light">
							{s}
						</option>
					))}
				</select>
			</div>
			{products.map(p => (
				<div key={p._id} className="px-3 py-2 flex flex-wrap">
					<img src={p.preview.url} className="w-24" />
					<div className="pl-5">
						<p className="font-bold">{p.productName}</p>
						<p className="text-color-secondary-light">
							{p.categories.join(", ")}
						</p>
						<p>${p.price}</p>
					</div>
					<p className="text-lg ml-auto self-center">x {p.quantity}</p>
				</div>
			))}
			<div className="flex mt-4">
				<div>
					<p>Address: {address}</p>
					<p>Phone: {phone}</p>
					<p>Addtional information : {user.instructions || "none"}</p>
				</div>
				<p className="ml-auto text-right font-bold">
					Total: $
					{products
						.reduce((prev, p) => prev + p.quantity * p.price, 0)
						.toFixed(2)}
				</p>
			</div>
		</div>
	);
};

const AdminOrders = ({ orders }) => {
	const rows = orders.map(o => ({
		rowContent: {
			orderId: o._id,
			customerId: o.user._id,
			customer: `${o.user.firstName} ${o.user.lastName}`,
			orderedAt: o.date
		},
		collapsibleContent: <CollapsibleContent {...o} />
	}));

	return (
		<Container>
			<SubHeader title="All Orders" />
			<ListCollapsible header={headers} rows={rows} />
		</Container>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const isNotAdmin = checkPermission(req, res);
		if (isNotAdmin) return isNotAdmin;

		const orders = await client.getOrders();

		return {
			props: {
				orders: orders.map(
					({ _id, address, user, date, phone, products, status }) => ({
						_id,
						address,
						user,
						date,
						phone,
						products,
						status
					})
				)
			}
		};
	}
});

export default AdminOrders;
