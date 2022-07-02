import React, { useRef } from "react";
import { XIcon } from "@heroicons/react/solid";
import Slider from "react-slick";

const LightBox = ({ sliderSettings, currSrc, imgGallery, closeModal }) => {
	const modalSliderControl = useRef(null);

	return (
		<div className="fixed top-0 left-0 z-999 w-full h-full">
			<div className="absolute bg-gray-800 opacity-70 w-full h-full top-0 left-0"></div>
			<div className="w-[80%] max-w-[600px] h-full max-h-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md">
				<Slider
					{...sliderSettings}
					ref={modalSliderControl}
					initialSlide={currSrc}
					beforeChange={null}
				>
					{imgGallery}
				</Slider>
				<button
					className="absolute rounded-full -top-0 -right-10"
					onClick={closeModal}
				>
					<XIcon
						className="h-8 w-8 hover:text-color-primary-light"
						color="#fff"
					/>
				</button>
				<button
					className="z-999 w-12 h-12 rounded-full absolute top-1/2 transform -tranlate-y-1/2 -left-6 shadow-md flex items-center justify-center bg-white"
					onClick={() =>
						modalSliderControl && modalSliderControl.current.slickPrev()
					}
				>
					<img
						src="/icon-previous.svg"
						alt="navigator to previous photo"
					/>
				</button>
				<button
					className="z-999 w-12 h-12 rounded-full absolute top-1/2 transform -tranlate-y-1/2 -right-6 shadow-md flex items-center justify-center bg-white"
					onClick={() =>
						modalSliderControl && modalSliderControl.current.slickNext()
					}
				>
					<img src="/icon-next.svg" alt="navigator to next photo" />
				</button>
			</div>
		</div>
	);
};

export default LightBox;
