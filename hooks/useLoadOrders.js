import React, { useEffect, useState, useRef } from "react";

import client from "../utils/sanity.client";

const useLoadOrder = (initialOrders, index, userId) => {
	const firstRender = useRef(true);
	const [isLoading, setLoading] = useState(false);
	const [orders, setOrders] = useState(initialOrders);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}

		client
			.getOrdersByUserId(userId, index)
			.then(res => {
				if (res.length) {
					setOrders(prev => [...prev, ...res]);
				} else setHasMore(false);
			})
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
	}, [index]);

	return { isLoading, orders, hasMore };
};

export default useLoadOrder;
