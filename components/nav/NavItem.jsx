import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NavItem = ({ Icon, title }) => {
	const currentPath = useRouter().asPath;
	const targetLocation = {
		PRODUCTS: "/",
		ACCOUNT: "/user/summary",
		CART: "/user/cart"
	};

	const matchCurrPath = () => {
		switch (title) {
			case "PRODUCTS":
				return /\/products\?page=\d+/.test(currentPath);
			case "ACCOUNT":
				return /\/(admin|user)\/(?!cart)/.test(currentPath);
			case "CART":
				return currentPath === "/user/cart";
			default:
				return false;
		}
	};

	return (
		<div className="hover:text-[#03B176] cursor-pointer mr-4 sm:mr-8 last:mr-0">
			<Link href={targetLocation[title]}>
				<a
					className={`flex items-center ${
						matchCurrPath() &&
						"border-b-solid border-b-2 border-color-primary pb-1 relative top-1"
					}`}
					aria-label={`navigate to ${title.toLowerCase()} page`}
				>
					<Icon className="h-6 inline-block sm:hidden" />
					<span className="hidden tracking-wider font-semibold sm:inline-block leading-6">
						{title}
					</span>
				</a>
			</Link>
		</div>
	);
};

export default NavItem;
