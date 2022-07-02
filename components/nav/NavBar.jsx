import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";
import {
	ShoppingCartIcon,
	UserCircleIcon,
	ShoppingBagIcon
} from "@heroicons/react/outline";
import { useUser } from "@auth0/nextjs-auth0";

import NavItem from "./NavItem";

const Nav = () => {
	const headerRef = useRef(null);
	const router = useRouter();
	const isHome = router.asPath.match(/\/products\?page=(.+)/);

	useEffect(() => {
		function handleNavStyle() {
			const option =
				window.scrollY >= headerRef.current.offsetHeight ? "add" : "remove";
			headerRef.current.classList[option]("text-black");
			headerRef.current.classList[option]("bg-[rgba(235,235,235,0.9)]");
		}

		if (isHome) {
			window.addEventListener("scroll", handleNavStyle);
		}

		return () => removeEventListener("scroll", handleNavStyle);
	});

	return (
		<nav
			className={`bg-transparent ${isHome ? "fixed" : "block"} z-999 w-full`}
		>
			<div
				className={`flex py-3 sm:py-5 px-[5vw] xl:px-[8vw] justify-between ${
					!isHome ? "text-black" : "text-white"
				} transition duration-200`}
				ref={headerRef}
			>
				<div className="text-3xl font-bold tracking-wider flex">
					Plant.<span className="text-[#03B176]">io</span>
				</div>
				<div
					className={`flex justify-evenly items-center text-sm ${
						!isHome && "text-black"
					}`}
				>
					<NavItem Icon={ShoppingBagIcon} title="PRODUCTS" />
					<NavItem Icon={ShoppingCartIcon} title="CART" />
					<NavItem Icon={UserCircleIcon} title="ACCOUNT" />
				</div>
			</div>
			{!isHome && <Divider light className="w-[90vw] xl:w-[85vw] mx-auto" />}
		</nav>
	);
};

export default Nav;
