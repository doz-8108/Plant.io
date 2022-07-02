import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import Container from "../../components/user/Container";
import SubHeader from "../../components/shared/SubHeader";
import List from "../../components/shared/List";
import ProductForm from "../../components/user/admin/ProductForm";
import client from "../../utils/sanity.client";
import checkPermission from "../../utils/checkPermission";

const headers = [
	{ label: "id", field: "id", minWidth: 300 },
	{ label: "name", field: "name", minWidth: 300 },
	{ label: "categories", field: "categories", minWidth: 300 }
];

const products = () => {
	const [action, setAction] = useState("create");
	const [currentProduct, setCurrentProduct] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [products, setProducts] = useState([]);

	const handleOpen = () => setModalOpen(true);
	const handleClose = () => setModalOpen(false);

	const fetchProducts = () =>
		client.getProducts().then(data => {
			setProducts(data.map(p => ({ ...p, id: p._id, name: p.productName })));
		});

	const searchMethod = name => {
		client
			.getProductsByName(name)
			.then(data =>
				setProducts(data.map(p => ({ ...p, id: p._id, name: p.productName })))
			);
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<Container>
			<SubHeader title="All Products" />
			<button
				className="absolute top-[115%] xl:top-full right-10 z-999"
				onClick={() => {
					setAction("create");
					handleOpen();
				}}
			>
				<PlusIcon className="w-12 h-12 rounded-full bg-color-primary-light p-2" />
			</button>
			<List
				header={headers}
				list={products}
				fetchProducts={fetchProducts}
				setCurrentProduct={setCurrentProduct}
				setAction={setAction}
				handleOpen={handleOpen}
				searchMethod={searchMethod}
			/>
			<ProductForm
				action={action}
				open={modalOpen}
				handleClose={handleClose}
				fetchProducts={fetchProducts}
				currentProduct={currentProduct}
			/>
		</Container>
	);
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		const isNotAdmin = checkPermission(req, res);
		if (isNotAdmin) return isNotAdmin;

		return {
			props: {}
		};
	}
});

export default products;
