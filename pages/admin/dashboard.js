import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import dayjs from "dayjs";
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
	StarIcon,
	DocumentTextIcon,
	UserGroupIcon,
	ChatIcon
} from "@heroicons/react/outline";

import client from "../../utils/sanity.client";
import checkPermission from "../../utils/checkPermission";
import NewComments from "../../components/user/admin/NewComments";
import SubHeader from "../../components/shared/SubHeader";
import Container from "../../components/user/Container";

const Dashboard = ({
	dataByMonth: { sales, profit },
	dataByYear,
	top5Products,
	comments
}) => {
	const [cmModalOpen, setCmModalOpen] = useState(false);
	const chart = useRef(null);

	const handleOpen = () => setCmModalOpen(true);
	const handleClose = () => setCmModalOpen(false);

	useEffect(() => {
		const data = {
			labels: [
				"Jan",
				"Feb",
				"March",
				"April",
				"May",
				"June",
				"July",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			datasets: [
				{
					label: "Profit",
					backgroundColor: "#38e190",
					borderColor: "#38e190",
					data: dataByYear.map(d => d.profit)
				},
				{
					label: "Orders",
					backgroundColor: "#4B5563",
					borderColor: "#4B5563",
					data: dataByYear.map(d => d.sales)
				}
			]
		};

		const salesChart = new Chart(chart.current, {
			type: "line",
			data: data,
			options: {
				elements: {
					line: {
						borderCapStyle: "round"
					}
				},
				maintainAspectRatio: false,
				plugins: {
					legend: {
						// display: false
						align: "end",
						padding: 10
					}
				},
				scales: {
					y: {
						ticks: {
							maxTicksLimit: 7
						}
					},
					x: {
						grid: {
							display: false
						}
					}
				}
			}
		});
	}, []);

	return (
		<Container>
			<SubHeader title="Dashboard" />
			<div className="w-full grid grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-x-6 justify-items-center lg:justify-items-start">
				{/* Profit block */}
				<div className="w-11/12 col-span-1 bg-dashboard-profit-1 h-32 shadow-lg rounded-lg flex flex-col sm:flex-row items-center justify-evenly text-gray-600">
					<div className="p-1 sm:p-2 rounded-full bg-white self-start sm:self-auto ml-2 sm:ml-0 mt-2 sm:mt-0">
						<StarIcon className="w-6 h-6 sm:w-9 sm:h-9" />
					</div>
					<div className="max-w-[170px] break-words">
						<p className="text-2xl sm:text-3xl font-semibold">$ {profit}</p>
						<p className="text-sm">Monthly Profit</p>
					</div>
					<span className="bg-gray-600 text-white py-1 px-2 rounded-tl-2xl rounded-bl-sm rounded-tr-sm rounded-br-2xl w-14 self-end sm:self-auto mr-1 sm:mr-0 mb-2 sm:mb-0">
						+32%
					</span>
				</div>

				{/* Orders block */}
				<div className="col-span-1 bg-color-secondary h-32 shadow-lg rounded-lg w-11/12 flex flex-col sm:flex-row items-center justify-evenly text-white">
					<div className="p-1 sm:p-2 rounded-full bg-white text-color-secondary ml-2 sm:ml-0 mt-2 sm:mt-0 self-start sm:self-auto">
						<DocumentTextIcon className="w-6 h-6 sm:w-9 sm:h-9" />
					</div>
					<div className="max-w-[150px] break-words">
						<p className="text-2xl sm:text-3xl font-semibold">{sales}</p>
						<p className="text-sm">Orders</p>
					</div>
					<span className="bg-gray-600 text-white py-1 px-2 rounded-tl-2xl rounded-bl-sm rounded-tr-sm rounded-br-2xl w-14 text-center mr-1 sm:mr-0 mb-2 sm:mb-0 self-end sm:self-auto">
						+20
					</span>
				</div>

				{/* Best selling items */}
				<div className="mt-10 lg:mt-0 ml-5 lg:ml-8 col-start-1 lg:col-start-3 col-span-2 row-start-2 row-span-1 lg:row-span-2 overflow-x-scroll">
					<p className="text-xl font-semibold text-color-secondary">
						🔥 Top selling products
					</p>
					<ul className="pt-5">
						{top5Products.map((p, index) => (
							<li key={p._id}>
								<Link href={`/products/${p._id}`}>
									<a className="inline-flex w-full my-1 items-center hover:bg-gray-100 px-1 py-2 rounded-md cursor-pointer">
										<span className="ml-2">{index + 1}</span>
										<div className="w-16 h-16 mx-5 border rounded-xl shadow-md overflow-hidden bg-white flex justify-center items-center">
											<img src={p.previews[0].url} alt="image of the product" />
										</div>
										<div>
											<p className="font-semibold text-color-secondary">
												{p.productName}
											</p>
											<p className="text-color-primary">${p.price}</p>
										</div>
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Statistics */}
				<div className="w-full col-start-1 col-span-2 row-start-3 lg:row-start-2 row-end-4 self-stretch h-[470px] mt-5 mb-10 rounded-lg p-2 shadow-m">
					<p className="text-color-secondary font-semibold text-xl ml-5 lg:ml-0">
						Sales statistics
					</p>
					<canvas ref={chart}></canvas>
				</div>

				{/* Visitors & New Comments block */}
				<div className="w-full mt-2 ml-8 col-start-1 lg:col-start-3 col-span-2 lg:col-span-1 h-max lg:shadow-md row-start-4 lg:row-start-3 row-span-1 rounded-lg flex flex-row lg:flex-col lg:justify-between text-color-secondary overflow-hidden self-end mb-5 lg:mb-0">
					<div className="flex items-center justify-evenly hover:bg-gray-50 cursor-pointer sm:p-2 mr-4 lg:mr-0">
						<div className="relative mr-2 md:mr-4 lg:mr-0">
							<div className="w-12 h-12 bg-color-primary-hover flex justify-center items-center p-2 rounded-full">
								<ChatIcon className="w-9 h-9 text-color-primary" />
								<div className="w-5 h-5 text-sm  absolute top-0 right-0 transform -translate-y-1/4 translate-x-1/4 text-white bg-red-500 p-1 rounded-full flex items-center justify-center">
									36
								</div>
							</div>
						</div>
						<button
							className="text-sm sm:text-base md:w-[150px] text-left"
							onClick={handleOpen}
						>
							<p className="text-secondary-light font-semibold text-gray-600">
								New Comments
							</p>
							<p className="text-gray-500">View them here</p>
						</button>
					</div>
					<div className="flex justify-evenly items-center py-2 mr-2 md:mr-0">
						<div className="w-12 h-12 bg-color-primary-hover flex justify-center items-center p-2 rounded-full mr-2 md:mr-4 lg:mr-0">
							<UserGroupIcon className="w-9 h-9 text-color-primary" />
						</div>
						<div className="text-sm sm:text-base md:w-[150px]">
							<p className="sm:text-lg font-semibold text-gray-600">1265</p>
							<p className="text-gray-500">Monthly Visitors</p>
						</div>
					</div>
				</div>
			</div>
			<NewComments
				comments={comments}
				open={cmModalOpen}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Container>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const isNotAdmin = checkPermission(req, res);
		if (isNotAdmin) return isNotAdmin;

		const month = dayjs().month();
		const dataByYear = await client.getDataByYear();
		const dataByMonth = dataByYear[month];

		const top5Products = await client.getProductBySales();
		const comments = await client.getUnPublishedComments();

		return {
			props: {
				dataByYear,
				dataByMonth,
				top5Products,
				comments
			}
		};
	}
});

export default Dashboard;
