import React, { useState } from "react";
import { Divider } from "@mui/material";
import { TrashIcon } from "@heroicons/react/outline";

import { pushErrorAlert } from "../../../utils/alert";

const CardList = ({ paymentMethods }) => {
	const [cards, setCards] = useState(paymentMethods);

	const detachPaymentMethod = async cardId => {
		try {
			await fetch("/api/payment/detachPaymentMethod", {
				headers: {
					"Content-type": "application/json"
				},
				method: "POST",
				body: JSON.stringify({
					cardId
				})
			});

			setCards(prev => prev.filter(p => p.id !== cardId));
		} catch (error) {
			pushErrorAlert("Service is not available!");
		}
	};

	return (
		<div className="mt-5 mx-5 xl:mx-0 relative bg-cardList bg-no-repeat bg-pos-cardList">
			<span className="mb-2 block">Payment Methods</span>
			<Divider light className="min-w-[300px]" />
			{cards.length ? (
				<ul className="mb-10 sm:h-[75%] overflow-y-scroll rounded-sm opacity-95">
					{cards.map(({ id, brand, last4, exp_month, exp_year }) => (
						<li
							className="bg-white rounded-lg w-[95%] h-28 shadow-lg mx-auto my-3 flex items-center lg:justify-evenly"
							key={id}
						>
							<img
								className="w-12 h-12 sm:w-20 sm:h-20 lg:w-12 lg:h-12 lg:mx-0 sm:mx-10 mx-7"
								src={`/card-logos/${brand}.svg`}
								alt={`${brand} card logo`}
							/>
							<div className="max-w-[100px]">
								<p className="font-semibold text-sm break-words">
									{brand.replace("_", " ").toUpperCase()}
								</p>
								<p>
									<span className="text-xl"> •••• </span>
									<span>{last4}</span>
								</p>
								<p className="text-sm text-gray-500">
									Expires {exp_month}/{exp_year}
								</p>
							</div>
							<button
								className="hover:text-red-500 ml-auto mr-10 lg:m-0"
								onClick={() => detachPaymentMethod(id)}
							>
								<TrashIcon className="w-8 h-8 sm:w-10 sm:h-w-10 xl:w-6 xl:h-6" />
							</button>
						</li>
					))}
				</ul>
			) : (
				<span className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg text-gray-500">
					Payment method will be saved on the checkout step
				</span>
			)}
		</div>
	);
};

export default CardList;
