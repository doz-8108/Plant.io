import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";

import useDebounce from "../../hooks/useDebounce";
import Hero from "../../components/Home/Hero";
import Filters from "../../components/Home/Filters";
import Pagination from "@mui/material/Pagination";
import Product from "../../components/Home/ProductCard";
import client from "../../utils/sanity.client";
import useLoadProducts from "../../hooks/useLoadProducts";
import useCart from "../../hooks/useCart";

const Home = props => {
	const router = useRouter();
	const page = Number(router.query.page) || 0;
	const productCount = props.products.length;
	const { addItem } = useCart();

	// filtering
	const [sortBy, setSortBy] = useState("");
	const [chosenCats, setChosenCats] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm);
	const handleSearch = e => setSearchTerm(e.target.value);

	const { products, pageCount, currPage, setCurrPage } = useLoadProducts(
		props.products,
		sortBy,
		chosenCats,
		debouncedSearchTerm,
		page,
		productCount
	);

	return (
		<>
			<Hero />
			<main>
				<section aria-label="recommendations">
					<h2 className="mt-10 xl:mb-10 text-center font-bold text-xl sm:text-4xl font-grace">
						Best-seller Products
					</h2>
					<div className="flex justify-center overflow-x-scroll scrollbar-hide">
						<div className="flex py-5">
							{props.topSellers.map(product => (
								<Product
									type="small"
									key={product.pid}
									addItem={addItem}
									{...product}
								/>
							))}
						</div>
					</div>
				</section>
				<Filters
					categories={props.categories}
					handleSearch={handleSearch}
					chosenCats={chosenCats}
					setChosenCats={setChosenCats}
					sortBy={sortBy}
					setSortBy={setSortBy}
				/>
				<hr className="mx-auto w-1/2 mb-5" />
				{currPage > pageCount - 1 ? (
					<p className="m-5 text-center">No more products</p>
				) : (
					<section
						className="lg:w-11/12 xl:w-full 2xl:w-9/12 lg:mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:flex 3xl:flex-wrap"
						aria-label="products"
					>
						{products.map(product => (
							<Product
								type="large"
								key={product.pid}
								addItem={addItem}
								{...product}
							/>
						))}
					</section>
				)}

				<div className="mt-52 mb-20 flex justify-center">
					<Pagination
						className="mx-auto"
						page={currPage + 1}
						count={pageCount}
						onChange={(e, n) => setCurrPage(n - 1)}
					/>
				</div>
			</main>
		</>
	);
};

export const getServerSideProps = async () => {
	const products = (await client.getProducts()).filter(p => p.stock !== 0);
	const topSellers = (await client.getProductBySales()).filter(
		p => p.stock !== 0
	);

	const categories = Array.from(
		new Set(products.reduce((prev, r) => [...prev, ...r.categories], []))
	);

	const retrieveProps = p => ({
		pid: p._id,
		name: p.productName,
		categories: p.categories.join(", "),
		rating: p.rating,
		price: p.price,
		stock: p.stock,
		img: p.previews[0].url,
		discount: p.discount
	});

	return {
		props: {
			topSellers: topSellers.map(retrieveProps),
			products: products.map(retrieveProps),
			categories
		}
	};
};

export default Home;
