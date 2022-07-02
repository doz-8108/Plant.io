import React, { useState, useEffect } from "react";

const useDebounce = (val, delay = 500) => {
	const [debouncedVal, setDebouncedVal] = useState("");

	useEffect(() => {
		let timer = setTimeout(() => {
			setDebouncedVal(val);
		}, delay);

		return () => clearTimeout(timer);
	}, [val]);

	return debouncedVal;
};

export default useDebounce;
