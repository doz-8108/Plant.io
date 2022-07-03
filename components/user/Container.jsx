import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import SideNav from "./SideNav";

const Container = ({ children }) => {
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const [displaySideNav, toggleSideNav] = useState(false);
	const handleSideNav = () => toggleSideNav(prev => !prev);

	return (
		<div className="mt-5 min-h-100vh">
			<div className="mx-auto relative flex flex-col items-center lg:flex-row lg:justify-center lg:items-start sm:px-5">
				{(isDesktop || displaySideNav) && <SideNav />}
				{!isDesktop && (
					<button
						className="rounded-full shadow-lg p-2 fixed flex items-center justify-center bg-white right-[8vw] z-999"
						onClick={handleSideNav}
					>
						{displaySideNav ? (
							<XIcon className="w-7 h-7" />
						) : (
							<MenuIcon className="w-7 h-7" />
						)}
					</button>
				)}
				<div className="w-[95%] xl:w-[1024px]">{children}</div>
			</div>
		</div>
	);
};

export default Container;
