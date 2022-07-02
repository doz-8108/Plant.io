import React, { useEffect, useState, useRef } from "react";

const sorting = {
	PRICE_LOW2HIGH: (a, b) => a.price * a.discount - b.price * b.discount,
	PRICE_HIGH2LOW: (a, b) => b.price * b.discount - a.price * a.discount,
	POPULARITY: (a, b) => a.sales - b.sales
};

const useLoadProducts = (
	initialProducts,
	sortBy,
	chosenCats,
	searchTerm,
	initialPage,
	productCount
) => {
	const itemPerPage = 12;
	const firstRender = useRef(true);
	const [products, setProducts] = useState(
		initialProducts.slice(0, itemPerPage)
	);
	const [currPage, setCurrPage] = useState(initialPage);
	const [pageCount, setPageCount] = useState(
		Math.ceil(productCount / itemPerPage)
	);

	const filterProductsBySearch = () => {
		const result = initialProducts.filter(
			p =>
				(!chosenCats.length ||
					_.difference(p.categories.split(", "), chosenCats).length === 0) &&
				p.name.toLowerCase().startsWith(searchTerm.toLowerCase())
		);
		return sortBy ? result.sort(sorting[sortBy]) : result;
	};

	// pagination
	useEffect(() => {
		const pathname = `${window.location.pathname}?page=${currPage}`;
		window.history.pushState({ path: pathname }, "", pathname);

		const startIndex = currPage * itemPerPage;
		const productsFiltered = filterProductsBySearch();

		setProducts(productsFiltered.slice(startIndex, startIndex + itemPerPage));
	}, [currPage]);

	// client-side search
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}

		const productsFiltered = filterProductsBySearch();
		setProducts(productsFiltered.slice(0, itemPerPage));
		setPageCount(Math.ceil(productsFiltered.length / itemPerPage));
		setCurrPage(0);
	}, [searchTerm, chosenCats, sortBy]);

	return { products, pageCount, currPage, setCurrPage };
};

export default useLoadProducts;
