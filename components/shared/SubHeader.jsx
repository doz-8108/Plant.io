import React from "react";
import { ChevronRightIcon } from "@heroicons/react/outline";

const SubHeader = ({ title }) => {
	return (
		<div className="w-full ml-2 mr-auto flex items-center my-5">
			<span className="text-[#059e6b]">Your Account</span>
			<ChevronRightIcon className="h-3 inline-block mx-2" />
			<span>{title}</span>
		</div>
	);
};

export default SubHeader;
