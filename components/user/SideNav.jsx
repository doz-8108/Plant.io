import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	LogoutIcon,
	TruckIcon,
	IdentificationIcon,
	QuestionMarkCircleIcon,
	ChartBarIcon,
	UsersIcon,
	ShoppingCartIcon,
	DocumentTextIcon
} from "@heroicons/react/outline";
import { Divider, useMediaQuery } from "@mui/material";

const tabsDisplay = type => {
	const iconStyle = "w-6 h-6 ml-2 mr-3 inline-block";
	return type === "user"
		? [
				{
					title: "Summary",
					icon: <IdentificationIcon className={iconStyle} />
				},
				{ title: "Orders", icon: <TruckIcon className={iconStyle} /> },
				{
					title: "FAQ",
					icon: <QuestionMarkCircleIcon className={iconStyle} />
				}
		  ]
		: [
				{
					title: "Dashboard",
					icon: <ChartBarIcon className={iconStyle} />
				},
				{ title: "Users", icon: <UsersIcon className={iconStyle} /> },
				{
					title: "Orders",
					icon: <DocumentTextIcon className={iconStyle} />
				},
				{
					title: "Products",
					icon: <ShoppingCartIcon className={iconStyle} />
				}
		  ];
};

const SideNav = () => {
	const router = useRouter();
	const currentPath = router.asPath;
	const currentTab = currentPath.match(/\/(.+)\/(.+)/)?.[2];
	const userType = currentPath.match(/\/(.+)\//)[1];

	const tabs = tabsDisplay(userType);
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	useEffect(() => {
		document.body.style.overflowY = "scroll";

		if (!isDesktop) document.body.style.overflowY = "hidden";

		return () => {
			document.body.style.overflowY = "scroll";
		};
	}, [isDesktop]);

	return (
		<>
			<nav
				className={`mr-20 xl:mt-10 xl:h-[720px] w-60 flex flex-col text-center break-words xl:rounded-xl shadow-xl ${
					userType === "admin"
						? "bg-adminSideNav bg-pos-adminSideNav"
						: "bg-userSideNav bg-pos-userSideNav"
				} bg-color-white bg-no-repeat overflow-hidden fixed xl:relative z-999 bg-color-sideNav top-0 left-0 h-[100vh] transition-transform animate-sideNavL2R xl:animate-none
				aria-label="user page navigation`}
			>
				{!isDesktop && (
					<div className="text-3xl font-bold tracking-wider">
						<p className="text-left ml-6 my-3 sm:my-5">
							Plant.<span className="text-[#03B176]">io</span>
						</p>
						<Divider light className="w-full" />
					</div>
				)}
				<ul className="flex flex-col mt-12 xl:mt-0">
					{tabs.map((tab, index) => {
						const titleLowerCase = tab.title.toLowerCase();
						const path =
							tab.title === "FAQ" ? "/faq" : `/${userType}/${titleLowerCase}`;
						const samePath = titleLowerCase === currentTab;

						return (
							<Link key={`side-${index}`} href={path}>
								<li
									className={`text-left w-auto mx-0 cursor-pointer p-2 py-4 hover:bg-gray-100 text-gray-700 ${
										samePath && "bg-gray-100 text-[#19B176]"
									}`}
								>
									<a onClick={e => samePath && e.preventDefault()}>
										{tab.icon}
										<span className="inline-block text-sm font-semibold">
											{tab.title}
										</span>
									</a>
								</li>
							</Link>
						);
					})}
					<button className="flex items-center p-2 py-4 font-semibold text-red-500 hover:text-white hover:bg-red-500 text-sm">
						<Link href="/api/auth/logout">
							<a>
								<LogoutIcon className="w-6 h-6 inline-block ml-2 mr-3 " />
								Logout
							</a>
						</Link>
					</button>
				</ul>
			</nav>
			{!isDesktop && (
				<div className="w-[100vw] h-[100vh] fixed top-0 left-0 z-998 bg-black opacity-60"></div>
			)}
		</>
	);
};

export default SideNav;
