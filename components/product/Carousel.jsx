import React, { useState, useRef } from "react";
import Slider from "react-slick";
import { useMediaQuery } from "@mui/material";

import LightBox from "./LightBox";

const Carousel = ({ images }) => {
	const isTabletOrBelow = useMediaQuery("(max-width: 1024px)");
	const sliderControl = useRef(null);
	const [currSrc, setSrc] = useState(0);
	const [modalOpen, setOpen] = useState(false);

	const openModal = () => {
		if (!isTabletOrBelow && !modalOpen) {
			document.body.style.overflowY = "hidden";
			setOpen(true);
		}
	};
	const closeModal = () => {
		if (modalOpen) {
			document.body.style.overflowY = "scroll";
			setOpen(false);
		}
	};

	const handleSwitch = index => {
		sliderControl.current.slickGoTo(index);
	};

	const imgGallery = images.map((img, index) => (
		<img
			src={img}
			key={`preview-${index}`}
			alt="Product Photo"
			className="w-full lg:h-full rounded-md"
			onClick={openModal}
		/>
	));

	const sliderSettings = {
		dots: false,
		infinite: true,
		speed: 500,
		SlidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		beforeChange: (_, newIndex) => setSrc(newIndex)
	};

	return (
		<div className="relative">
			<div className="lg:w-[450px] lg:h-[450px] mx-auto col-span-1 lg:rounded-xl lg:shadow-sm overflow-hidden relative cursor-pointer">
				{isTabletOrBelow && (
					<>
						<button
							className="z-999 w-12 h-12 rounded-full absolute top-1/2 transform -tranlate-y-1/2 left-2 shadow-md flex items-center justify-center bg-white"
							onClick={() => sliderControl && sliderControl.current.slickPrev()}
						>
							<img src="/icon-previous.svg" alt="navigator to previous photo" />
						</button>
						<button
							className="z-999 w-12 h-12 rounded-full absolute top-1/2 transform -tranlate-y-1/2 right-2 shadow-md flex items-center justify-center bg-white"
							onClick={() => sliderControl && sliderControl.current.slickNext()}
						>
							<img src="/icon-next.svg" alt="navigator to next photo" />
						</button>
					</>
				)}
				<Slider {...sliderSettings} ref={sliderControl}>
					{imgGallery}
				</Slider>
			</div>
			{!isTabletOrBelow && (
				<div className="mt-10 t">
					{images.map((img, index) => {
						return (
							<button
								key={`navBtn-${index}`}
								onClick={() =>
									currSrc !== index && sliderControl && handleSwitch(index)
								}
								className={`w-[90px] h-[90px] inline-block shadow-md rounded-xl overflow-hidden mr-7 cursor-pointer transition-opacity duration-75 ${
									index === currSrc && "outline outline-3 outline-color-primary"
								}`}
							>
								<img
									className={`w-full h-full transition-opacity ${
										index === currSrc && "opacity-50"
									}`}
									src={img}
								/>
							</button>
						);
					})}
				</div>
			)}
			{modalOpen && !isTabletOrBelow && (
				<LightBox
					sliderSettings={sliderSettings}
					currSrc={currSrc}
					imgGallery={imgGallery}
					closeModal={closeModal}
				/>
			)}
		</div>
	);
};

export default Carousel;
