import React from "react";

export const ButtonPrimary = ({
	text,
	custom = null,
	event,
	disabled = false
}) => {
	return (
		<button
			disabled={disabled}
			onClick={event}
			className="bg-color-primary text-white w-max rounded-lg hover:bg-color-primary-light disabled:cursor-not-allowed disabled:hover:bg-color-primary shadow-sm py-2 px-5"
			style={custom}
		>
			{text}
		</button>
	);
};

export const TextButton = ({
	text,
	custom = null,
	event,
	disabled = false
}) => {
	return (
		<button
			disabled={disabled}
			onClick={event}
			className="self-start transition-all duration-150 bg-transparent border-solid border-b-color-primary border-b-2 text-color-primary lg:transition-all lg:hover:bg-color-primary lg:hover:text-white lg:p-1 lg:hover:transofrm lg:hover:-translate-y-1 lg:hover:shadow-lg"
			style={custom}
		>
			{text}
		</button>
	);
};
