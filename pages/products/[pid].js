import React, { useState } from "react";
import Image from "next/image";
import { Rating, useMediaQuery } from "@mui/material";
import { PlusIcon, MinusIcon } from "@heroicons/react/solid";
import { getSession } from "@auth0/nextjs-auth0";

import Carousel from "../../components/product/Carousel";
import Reviews from "../../components/product/Reviews";
import client from "../../utils/sanity.client";
import useCart from "../../hooks/useCart";
import { ButtonPrimary } from "../../components/shared/Buttons";
import { pushSuccessAlert } from "../../utils/alert";

const formatPrice = num => {
	const numInStr = num.toString();
	const splitted = numInStr.split(".");
	const indexOfFp = numInStr.indexOf(".");

	// no floating point value or floating point is less than 3
	if (splitted.length === 1 || splitted[1].length < 3) return num.toFixed(2);

	// else cut off the number up to 2 digit floating point value without round up/down
	return numInStr.substring(0, indexOfFp + 3);
};

const Product = ({
	productName,
	categories,
	rating,
	price,
	discount,
	previews,
	stock,
	description,
	comments,
	_id,
	enableComment
}) => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [qty, setQty] = useState(1);
	const { addItem } = useCart();

	const handleCount = e => {
		const newVal = qty + Number(e.currentTarget.value);
		newVal >= 1 && newVal <= stock && setQty(newVal);
	};

	return (
		<>
			<section className="lg:mt-20 justify-center lg:grid lg:grid-cols-productPage-narrow-screen xl:grid-cols-productPage-wide-screen grid-rows-productPage-lg gap-x-3 gap-y-8 justify-items-center">
				<Carousel images={previews} />
				<div className="col-start-2 col-end-3 row-start-1 row-end-3 my-14 font-kumbh px-5 lg:px-0">
					<p className="text-sm sm:text-base font-semibold tracking-wide uppercase text-color-primary leading-5">
						{categories}
					</p>
					<h1 className="mt-3 font-bold text-2xl sm:text-3xl lg:text-4xl tracking-wider uppercase">
						{productName}
					</h1>
					<p className="text-gray-500 mt-7 tracking-wide leading-7 lg:pr-40">
						{description}
					</p>
					<div className="mt-7 lg:block flex items-center flex-wrap">
						<p className="lg:mt-7 text-4xl leading-6 font-bold tracking-wide flex items-center">
							${discount < 1 ? formatPrice(price * discount) : price}
							{discount < 1 && (
								<span className="ml-3 text-lg font-semibold bg-color-primary-hover text-color-primary px-2 rounded-md">
									{discount * 100}%
								</span>
							)}
						</p>
						{discount < 1 && (
							<p className="ml-auto sm:ml-5 lg:ml-0 mt-3 text-xl text-gray-400 font-semibold tracking-wide line-through">
								${price}
							</p>
						)}
						<div className="w-full sm:w-auto sm:ml-auto mt-5 flex">
							<Rating readOnly precision={0.5} value={rating.avg} />
							<span className="ml-2">({rating.number} reviews)</span>
						</div>
					</div>
					<p className="sm:text-right lg:text-left">{stock} in stock</p>
					<div className="mt-10 flex flex-col lg:flex-row items-center">
						<div className="py-2 px-3 font-semibold rounded-md text-lg lg:w-[8rem] bg-gray-100 flex justify-between items-center lg:mr-10 w-full sm:w-[315px] mb-5 lg:mb-0 lg:items-stretch">
							<button
								aria-label="decrease one item"
								value="-1"
								onClick={e => handleCount(e)}
							>
								<MinusIcon className="transition-color h-5 w-5 text-color-primary hover:text-color-primary-light" />
							</button>
							<span>{qty}</span>
							<button
								aria-label="increase one item"
								value="1"
								onClick={e => handleCount(e)}
							>
								<PlusIcon className="transition-color h-5 w-5 text-color-primary hover:text-color-primary-light" />
							</button>
						</div>
						<ButtonPrimary
							event={() => {
								addItem({
									_id,
									img: previews[0],
									price,
									name: productName,
									qty,
									categories,
									stock
								});
								pushSuccessAlert("Product was added to your cart!");
							}}
							text={
								<>
									<Image src="/icon-cart.svg" width="16" height="16" />
									<span className="text-lg ml-3">Add to cart</span>
								</>
							}
							custom={
								isMobile
									? { padding: ".75rem 6rem", width: "100%" }
									: { padding: ".75rem 6rem" }
							}
						/>
					</div>
				</div>
			</section>
			<Reviews
				comments={comments}
				productId={_id}
				enableComment={enableComment}
			/>
		</>
	);
};

export const getServerSideProps = async ctx => {
	const { pid } = ctx.params;
	const session = getSession(ctx.req, ctx.res);

	const queries = [client.getProductById(pid), client.getProductComments(pid)];
	const [product, comments] = await Promise.all(queries);

	// enable comment only if user logged in & user does not have comment on this product
	let userCommentedBefore = true;
	if (session && session.user) {
		const userId = session.user.sub.split("|")[1];
		userCommentedBefore = await client.didCommentBefore(userId, pid);
	}
	const enableComment = session && session.user && !userCommentedBefore;

	return {
		props: {
			...product[0],
			previews: product[0].previews.map(({ url }) => url),
			rating: {
				avg: product[0].rating,
				number: comments.length
			},
			comments,
			enableComment
		}
	};
};

export default Product;
