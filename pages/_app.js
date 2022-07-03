import "../styles/globals.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@auth0/nextjs-auth0";

import Nav from "../components/nav/NavBar";

const MyApp = ({ Component, pageProps }) => {
	return (
		<div className="relative">
			<Head>
				<title>Plantio | Indoor Plants</title>
				<meta
					name="description"
					content="We, Plant.io is a e-shop dedicated to bring fresh lifestyle to customers by our potted plants."
				/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link
					rel="stylesheet"
					href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
					integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
					crossOrigin="anonymous"
				></link>
				<link rel="preconnect" href="https://fonts.googleapis.com"></link>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin
				></link>
				<link
					href="https://fonts.googleapis.com/css2?family=Covered+By+Your+Grace&family=Raleway:wght@400;500;700&family=Kumbh+Sans:wght@400;600;700&display=swap"
					rel="stylesheet"
				></link>
				<link
					rel="stylesheet"
					type="text/css"
					charset="UTF-8"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
				/>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
				/>
			</Head>
			<UserProvider>
				<Nav />
				<Component {...pageProps} />
			</UserProvider>
			<Toaster position="top-center" />
		</div>
	);
};

export default MyApp;
