import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { Divider, useMediaQuery } from "@mui/material";

const FaqItem = ({ question, answer, index = 1 }) => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [checked, setChecked] = useState(false);
	const onCheckBoxChange = () => !isMobile && setChecked(prev => !prev);

	return (
		<div className="flex flex-col my-4">
			<label
				className="sm:flex justify-between items-center py-2 cursor-pointer"
				htmlFor={`faq-${index}`}
			>
				<span className="sm:text-lg break-words font-semibold">{question}</span>
				{!isMobile && (
					<ChevronDownIcon
						className="h-6 w-6 text-color-primary"
						style={{
							transition: "transform .3s",
							transform: checked ? "rotate(180deg)" : "rotate(0)"
						}}
					/>
				)}
				<input
					className="cursor-pointer hidden"
					onChange={onCheckBoxChange}
					type="checkbox"
					checked={checked}
					id={`faq-${index}`}
				/>
			</label>
			{!isMobile && <Divider light className="w-full my-2" />}
			{(isMobile || checked) && (
				<p className="text-gray-500 text-sm sm:text-base">{answer}</p>
			)}
		</div>
	);
};

const faq = ({ faqs }) => {
	return (
		<main className="mt-8 mx-auto w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[55vw] xl:w-[45vw] max-w-[700px]">
			<h1 className="font-semibold text-xl sm:text-2xl mb-4 text-color-primary">
				Common Questions
			</h1>
			{faqs.map((faq, index) => (
				<FaqItem {...faq} index={index} key={index} />
			))}
			<div className="bg-faq bg-no-repeat bg-pos-faq w-full h-52 mt-20"></div>
		</main>
	);
};

export const getStaticProps = () => {
	return {
		props: {
			faqs: [
				{
					question: "Where are your physical store?",
					answer:
						"We are based in Hong Kong but we do not have any physical store yet. We also only provide services in Hong Kong."
				},
				{
					question: "Does Plant.io provide delivery service?",
					answer:
						"Yes, delivery service is provided for free. The leadtimes are typically between 7-14 days."
				},
				{
					question: "Can I amend my order once I have paid for it?",
					answer:
						"If you had made your purchase at our online shop, we will help you process amendments via e-mail (cs@plant.io). Please email us as soon as possible at least 3 days before the scheduled delivery."
				},
				{
					question: "What type of payment does Plant.io accept?",
					answer:
						"We only accept credit card (VISA, Master, JCB, American Express or China UnionPay) at this stage."
				},
				{
					question: "Does Plant.io accept returns?",
					answer:
						"If you are not satisfied with our products, you can email us (cs@plant.io) first with the details and return the unused products within 365 days from the date of purchase or 3 days after the goods collection."
				},
				{
					question:
						"What are the approximate leadtimes for the home delivery service?",
					answer:
						"Leadtimes do vary, but typically the leadtimes for the home delivery service are between 7-14 days to different districts in Hong Kong."
				},
				{
					question: "Could I pre-order out-of-stock items?",
					answer:
						"Sorry, we do not provide pre-order service for out-of-stock items."
				}
			]
		}
	};
};

export default faq;
