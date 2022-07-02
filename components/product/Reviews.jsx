import React, { useState } from "react";
import _ from "lodash";
import dayjs from "dayjs";
import { useUser } from "@auth0/nextjs-auth0";
import { PencilAltIcon } from "@heroicons/react/outline";
import { Divider, Rating } from "@mui/material";

import client from "../../utils/sanity.client";
import { TextButton } from "../shared/Buttons";
import { pushErrorAlert, pushSuccessAlert } from "../../utils/alert";

const ComposeComment = ({ productId, user, setCanWrite }) => {
	const userId = user.sub.split("|")[1];
	const [formValue, setForm] = useState({
		rating: 0,
		content: ""
	});

	const handleForm = (name, value) =>
		setForm({
			...formValue,
			[name]: value
		});

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await client.composeComment(
				formValue.content,
				formValue.rating,
				userId,
				productId
			);

			pushSuccessAlert("We have received your comment!");
			setCanWrite(false);
		} catch (error) {
			pushErrorAlert("Please fill in your contact information first!");
		}
	};

	return (
		<form
			className="flex flex-col mt-7 rounded-md shadow-xl sm:w-[600px] sm:mx-auto transition-transform animate-composeComment"
			onSubmit={e => handleSubmit(e)}
		>
			<h2 className="m-5 text-lg mb-0">Leave a Review</h2>
			<div className="ml-5 border-solid border-2 border-color-primary w-20"></div>
			<textarea
				className="mt-5 resize-none w-[93%] h-[150px] mx-auto border-solid border-gray-200 border-2 rounded-xl focus:border-color-primary p-2 text-lg outline-none mb-3"
				name="content"
				onChange={({ target: { name, value } }) => handleForm(name, value)}
				value={formValue.content}
			></textarea>
			<div className="flex flex-col">
				<div className="flex items-center">
					<label className="ml-5" htmlFor="rating-field">
						Your rating:
					</label>
					<Rating
						size="medium"
						sx={{ marginLeft: ".25rem" }}
						id="rating-field"
						name="rating"
						onChange={({ target: { name, value } }) =>
							handleForm(name, Number(value))
						}
						value={formValue.rating}
					/>
				</div>
				<TextButton
					text="Submit"
					custom={{
						margin: "1rem",
						marginLeft: "auto",
						paddingBottom: "0"
					}}
				/>
			</div>
		</form>
	);
};

const Reviews = ({ comments, productId, enableComment }) => {
	const { user } = useUser();
	const [composing, setCompose] = useState(false);
	const [canWrite, setCanWrite] = useState(enableComment);

	const toggleCompose = () => setCompose(prev => !prev);
	const cmCountByRating = _.countBy(comments, "rating");

	return (
		<section className="mt-32 xl:mt-44 px-[3vw] lg:px-[10vw] xl:px-[20vw] text-gray-500">
			<div className="mb-8 flex justify-between">
				<h2 className="text-2xl tracking-wider leading-8">Customer Reviews</h2>
				{canWrite && (
					<button
						className="p-2 text-color-primary hover:bg-green-100 active:bg-green-200 rounded-full"
						aria-label="leave a comment"
						title="leave a comment"
						onClick={toggleCompose}
					>
						<PencilAltIcon className="w-5 h-5" />
					</button>
				)}
			</div>
			<ul className="w-full">
				{[5, 4, 3, 2, 1].map((k, index) => {
					const ptg = (
						(cmCountByRating[k] / comments.length) * 100 || 0
					).toFixed(2);
					return (
						<li
							key={`distribution-${index}`}
							className="flex items-center leading-6"
						>
							<span className="w-14">{k} stars</span>
							<div className="h-2 overflow-hidden flex-grow mx-3 inline-flex items-center">
								<div
									className="bg-green-200 h-full rounded-md"
									style={{ width: `${ptg}%` }}
								></div>
								<Divider light className="h-1 flex-grow ml-2" />
							</div>
							<span>{ptg}%</span>
						</li>
					);
				})}
			</ul>
			{composing && canWrite && (
				<ComposeComment
					productId={productId}
					user={user}
					setCanWrite={setCanWrite}
				/>
			)}
			<ul className="my-24 flex flex-col">
				{comments.length ? (
					comments.map(c => {
						return (
							<li className="flex flex-col sm:flex-row my-6" key={c._id}>
								<div className="flex basis-1/3">
									<img
										className="w-10 h-10 mr-5 justify-self-center self-center sm:self-start"
										src="/product-review-default-avatar.svg"
										alt="avatar"
									/>
									<div className="flex flex-col">
										<p>{c.user.firstName + " " + c.user.lastName}</p>
										<p>{dayjs(c.createdAt).format("YYYY-MM-DD")}</p>
									</div>
								</div>
								<div className="flex flex-col basis-2/4 justify-between sm:mx-auto mt-2 sm:mt-0">
									<Rating size="small" value={c.rating} readOnly />
									<p className="break-words">{c.content}</p>
								</div>
							</li>
						);
					})
				) : (
					<p className="mx-auto">This product currently has no comment...</p>
				)}
			</ul>
		</section>
	);
};

export default Reviews;
