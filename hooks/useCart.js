import React, { useEffect, useState } from "react";

import { pushErrorAlert } from "../utils/alert";

const useCart = () => {
	const [items, setItems] = useState([]);

	useEffect(() => {
		const storedItems = localStorage.getItem("cart");

		if (storedItems) {
			try {
				const result = JSON.parse(storedItems);
				setItems(result);
			} catch (error) {
				pushErrorAlert("Invalid cart data!");
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(items));
	}, [items]);

	const addItem = product => {
		const cartClone = [...items];
		const targetIndex = cartClone.findIndex(i => i._id === product._id);

		if (targetIndex >= 0) {
			const isStockEnough =
				cartClone[targetIndex].qty + product.qty > product.stock;
			if (isStockEnough) cartClone[targetIndex].qty = product.stock;
			else cartClone[targetIndex].qty += product.qty;
		} else {
			cartClone.push(product);
		}

		setItems(cartClone);
	};

	const removeItem = _id => {
		setItems(items.filter(i => i._id !== _id));
	};

	const increaseItem = _id => {
		setItems(
			items.map(i => {
				if (i._id === _id && i.qty !== i.stock) {
					i.qty += 1;
				}

				return i;
			})
		);
	};

	const decreaseItem = _id => {
		setItems(
			items.reduce((prev, i) => {
				if (i._id === _id) {
					i.qty -= 1;
					if (i.qty > 0) prev.push(i);
				} else prev.push(i);

				return prev;
			}, [])
		);
	};

	return {
		items,
		addItem,
		removeItem,
		increaseItem,
		decreaseItem
	};
};

export default useCart;
