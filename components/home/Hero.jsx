import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronDoubleDownIcon } from "@heroicons/react/outline";

const Hero = () => {
	const titleContainer = useRef(null);
	const [imageLoaded, setImgLoaded] = useState(false);

	return (
		<header className="relative">
			{imageLoaded && (
				<div
					className="z-998 absolute text-white z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3 sm:-translate-y-1/2 text-center tracking-wide font-grace text-3xl md:text-5xl xl:text-6xl 2xl:text-8xl"
					ref={titleContainer}
				>
					<h1 className="mt-6 sm:mt-0">
						<p className="relative animate-heroTextLeft">INDOOR PLANTS</p>
						<p className="w-max relative animate-heroTextRight">
							REFRESH YOUR DAY
						</p>
					</h1>
					<div className="flex justify-center animate-bounce mt-3">
						<ChevronDoubleDownIcon className="h-7 md:h-10 relative animate-heroArrow animation" />
					</div>
				</div>
			)}
			<Image
				alt="home background image"
				src="/homeBg.jpeg"
				layout="responsive"
				width={1920}
				height={1080}
				quality={100}
				placeholder="blur"
				blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkm+tYDwAC+gFlRD4CZwAAAABJRU5ErkJggg=="
				onLoadingComplete={() => setImgLoaded(true)}
			/>
		</header>
	);
};

export default Hero;
