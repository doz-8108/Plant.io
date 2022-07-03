import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import { ChatAltIcon } from "@heroicons/react/outline";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import client from "../../utils/sanity.client";
import Container from "../../components/user/Container";
import SubHeader from "../../components/shared/SubHeader";
import sendEmail from "../../utils/sendEmail";
import useLoadOrder from "../../hooks/useLoadOrders";

const UserOrders = props => {
	const statusIconState = {
		preparing: "receipt text-yellow-400 ml-2 mr-1",
		shipping: "shipping-fast text-yellow-500 ml-2 mr-1",
		complete: "check-circle text-green-500 ml-2 mr-1",
		cancelled: "times-circle text-red-500 ml-2 mr-1"
	};

	const observer = useRef(null);
	const [index, setIndex] = useState(0);
	const { isLoading, orders, hasMore } = useLoadOrder(
		props.orders,
		index,
		props.userId
	);

	const lastOrderRef = useCallback(
		node => {
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(
				entries => {
					if (entries[0].isIntersecting && hasMore) {
						setIndex(index + 1);
					}
				},
				{ threshold: 0.5 }
			);

			if (node) observer.current.observe(node);
		},
		[orders]
	);

	return (
		<Container>
			<SubHeader title="Orders" />
			<div className="mt-5 flex flex-col items-center w-full text-center mx-auto">
				{orders.length ? (
					orders.map(
						(
							{
								products,
								user: {
									firstName,
									lastName,
									address,
									district,
									phone,
									instructions
								},
								_id,
								status,
								date
							},
							index
						) => (
							<div
								key={_id}
								className="border border-gray-200 rounded-md w-full h-5/6 flex flex-col justify-center flex-grow shadow-lg bg-white mb-5"
								ref={index === orders.length - 1 ? lastOrderRef : null}
							>
								<div className="flex flex-col sm:flex-row justify-between m-5">
									<div className="my-2 sm:my-0 flex flex-col items-start text-left">
										<div>
											<span className="mr-2 font-bold">Order number:</span>
											{_id}
										</div>
										<div>
											<span className="mr-2 font-bold">Date:</span>
											{date}
										</div>
									</div>
									<div className="my-2 sm:my-0 flex flex-col items-start">
										<div>
											<span>status:</span>
											<i className={`fas fa-${statusIconState[status]}`}></i>
											{status}
										</div>
									</div>
								</div>
								{products.map(
									(
										{
											productName,
											price,
											quantity,
											preview: { url: photo },
											_id
										},
										index
									) => (
										<div key={_id}>
											<div className="flex items-center justify-between">
												<div className="w-32 h-32 my-2 relative ml-2 sm:ml-5">
													<Image
														src={photo}
														layout="fill"
														alt="product preview"
													/>
												</div>
												<div className="flex flex-col items-end mr-5 text-right">
													<h1 className="font-semibold text-lg">
														{productName}
													</h1>
													<h2 className="text-gray-500 text-xl">${price}</h2>
													<h2 className="text-gray-800 text-xl font-medium">
														x {quantity}
													</h2>
												</div>
											</div>
											<hr
												className={`${
													index === products.length - 1 && "hidden"
												} border-t border-gray-200 w-11/12 mx-auto my-2`}
											/>
										</div>
									)
								)}
								<div className="flex flex-col items-start m-5 text-left">
									<div>
										<span className="mr-2 font-bold">Customer:</span>
										{`${firstName} ${lastName}`}
									</div>
									<div>
										<span className="mr-2 font-bold">Address:</span>
										{`${address} ${district}`}
									</div>
									<div>
										<span className="mr-2 font-bold">Phone:</span>
										{phone}
									</div>
									<div>
										<span className="mr-2 font-bold">Additional:</span>
										{instructions || "(none)"}
									</div>
									<div
										className="mt-5 flex w-full justify-end"
										onClick={() => sendEmail([""])}
									>
										<div className="group relative">
											<ChatAltIcon className="h-6 cursor-pointer text-[#19B176] animate-pulse" />
											<div className="hidden sm:group-hover:block p-1 rounded-md text-white bg-[#252525] text-sm text-center shadow-md absolute w-36 -top-20 transform -translate-x-28">
												Have a problem with the product? Email us!
											</div>
										</div>
									</div>
								</div>
							</div>
						)
					)
				) : (
					<div className="mt-20 text-xl text-gray-500">
						💨 You do not have any purchase yet
					</div>
				)}
				{isLoading && (
					<CircularProgress sx={{ color: "var(--color-primary)" }} />
				)}
			</div>
			<div className="bg-userOrderList bg-cover bg-no-repeat bg-pos-userOrderList w-full h-60"></div>
		</Container>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const { user } = getSession(req, res);
		const userId = user.sub.split("|")[1];

		const orders = await client.getOrdersByUserId(userId);

		return {
			props: {
				userId,
				orders
			}
		};
	}
});

export default UserOrders;
