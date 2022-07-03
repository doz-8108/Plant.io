import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Divider, Slide, useMediaQuery } from "@mui/material";
import { XIcon, PlusSmIcon, MinusSmIcon } from "@heroicons/react/outline";

import { ButtonPrimary, TextButton } from "../shared/Buttons";

const Summary = ({ products, increaseItem, decreaseItem, removeItem }) => {
	const router = useRouter();
	const isPortrait = useMediaQuery("(max-width: 1024px)");

	return (
		<Slide direction="right" mountOnEnter unmountOnExit in={true}>
			<div className="flex flex-col">
				<ul className="max-h-[480px] overflow-y-scroll shadow-md rounded-md">
					{products.map((p, index) => (
						<li className="flex flex-col" key={p._id}>
							<div className="flex p-2 w-full relative">
								<button
									className="top-0 right-0 absolute hover:bg-red-500 hover:text-white hover:rounded-xl p-1"
									onClick={() => removeItem(p._id)}
								>
									<XIcon className="w-4 h-4" />
								</button>
								<Link href={`/products/${p._id}`}>
									<a>
										<Image src={p.img} width="80" height="80" />
									</a>
								</Link>

								<div className="ml-2">
									<p className="font-semibold text-color-secondary text-xs sm:text-base">
										{p.name}
									</p>
									<p className="text-color-secondary-light text-xs sm:text-sm my-1">
										{p.categories}
									</p>
									<p className="text-color-primary">$ {p.price}</p>
								</div>
								<div className="absolute bottom-0 right-5 flex items-center">
									<button
										className="hover:bg-green-100 active:bg-green-200 p-1 rounded-2xl"
										onClick={() => increaseItem(p._id)}
									>
										<PlusSmIcon className="w-4 h-4" />
									</button>
									<span className="text-sm mx-2">{p.qty}</span>
									<button
										className="hover:bg-green-100 active:bg-green-200 p-1 rounded-2xl"
										onClick={() => decreaseItem(p._id)}
									>
										<MinusSmIcon className="w-4 h-4" />
									</button>
								</div>
							</div>
							{index === products.length - 1 ? (
								<div className="mb-5"></div>
							) : (
								<Divider light className="w-full my-5" />
							)}
						</li>
					))}
				</ul>
				<div className="w-full mt-10 col-start-1 flex justify-between">
					<Link href="/">
						<a>
							<TextButton text="&larr; Continue Shopping" />
						</a>
					</Link>
					<span className="text-color-secondary-light">
						Subtotal:
						<span className="ml-2 text-color-primary font-semibold text-lg">
							$
							{(
								products.reduce((prev, p) => prev + p.price * p.qty, 0) || 0
							).toFixed(2)}
						</span>
					</span>
				</div>
				{isPortrait && (
					<ButtonPrimary
						text="PROCEED"
						custom={{ margin: "1.25rem 0", marginLeft: "auto" }}
						event={() =>
							router.push({
								pathname: router.pathname,
								query: { section: "cart-billing" }
							})
						}
					/>
				)}
			</div>
		</Slide>
	);
};

export default Summary;
