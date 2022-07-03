import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import { PlusIcon } from "@heroicons/react/solid";

import { pushSuccessAlert } from "../../utils/alert";

const setDiemension = type => {
	return type === "small"
		? {
				container: "w-52 h-72 sm:w-60 sm:h-80 lg:w-72 lg:h-96",
				img: "w-48 h-48 sm:w-60 sm:h-52"
		  }
		: {
				container: "mx-auto my-5 w-11/12 h-80 sm:w-60 sm:h-96 lg:w-72",
				img: "w-48 h-48 sm:w-60 sm:h-52"
		  };
};

const ProductCard = ({
	pid,
	img,
	price,
	rating,
	name,
	type,
	categories,
	stock,
	discount,
	addItem
}) => {
	const style = setDiemension(type);

	const handleAddToCart = () => {
		addItem({
			img,
			price,
			name,
			categories,
			stock,
			_id: pid,
			qty: 1
		});
		pushSuccessAlert("Product was added to your cart!");
	};

	return (
		<div
			className={`p-3 ${
				type === "large" ? "mx-auto" : " mx-5"
			} flex items-center flex-col shadow-md rounded-lg transition duration-100 transform group sm:hover:scale-105 sm:hover:shadow-lg ${
				style.container
			} relative`}
		>
			{discount < 1 && (
				<div className="p-1 bg-color-primary-hover font-bold text-color-primary rounded-md ml-auto">
					-{Math.round((1 - discount) * 100)}%
				</div>
			)}
			<Link href={`/products/${pid}`}>
				<a
					aria-label="product detail"
					className={`relative ${style.img} cursor-pointer`}
				>
					<Image src={img} alt="product image" layout="fill" />
				</a>
			</Link>
			<div className="w-full pt-5">
				<h3 className="tracking-wider sm:text-lg xl:text-xl font-semibold">
					{name}
				</h3>
				<p className="font-monsterrat text-color-secondary-light text-sm overflow-hidden text-ellipsis whitespace-nowrap">
					{categories}
				</p>
				<Rating readOnly value={rating} size="small" />
				<p className="text-lg sm:text-xl xl:text-2xl text-color-secondary">
					<span>${(price * discount).toFixed(2)}</span>
					{discount < 1 && (
						<span className="pl-2 text-lg line-through text-color-secondary-light">
							${price}
						</span>
					)}
				</p>
				<button
					className="p-1 mr-1 mb-1 float-right text-white rounded-lg bg-color-primary hover:bg-color-primary-light h-9 w-32 md:w-9 md:group-hover:w-32 transition-width relative overflow-hidden"
					onClick={handleAddToCart}
				>
					<div className="transition-transform delay-150 w-max absolute top-1/2 md:-right-18 transform -translate-y-1/2 group-hover:left-1">
						<PlusIcon className="w-7 h-7 inline-block mr-1 relative -top-[0.5px]" />
						<div className="inline-flex items-center h-7">
							<span className="leading-7">Add to cart</span>
						</div>
					</div>
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
