import React, { useRef, useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { XIcon } from "@heroicons/react/outline";
import { PhotographIcon } from "@heroicons/react/solid";
import { Typography } from "@mui/material";
import { v4 } from "uuid";

import Modal from "./Modal";
import client from "../../../utils/sanity.client";
import { TextButton } from "../../shared/Buttons";
import { pushErrorAlert, pushSuccessAlert } from "../../../utils/alert";

const placeHolders = [
	{ placeholder: "Name of the product", field: "productName" },
	{ placeholder: "Description of the product", field: "description" },
	{ placeholder: "Discount of the product", field: "discount" },
	{ placeholder: "Price of the product", field: "price" },
	{ placeholder: "Stock of the product", field: "stock" }
];

const initialFormVal = {
	productName: "",
	description: "",
	categories: [],
	price: 0,
	stock: 0,
	rating: 0,
	discount: 1
};

const ProductForm = ({
	open,
	action,
	handleClose,
	fetchProducts,
	currentProduct = null
}) => {
	const uploader = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [availableCats, setAvailableCats] = useState([]);
	const [uploaded, setUploaded] = useState([]);
	const [formVal, setFormVal] = useState(initialFormVal);

	// display preview images
	const createDataURL = e => {
		if (!e.target.files || !e.target.files.length) return;
		const reader = new FileReader();

		const { files } = e.target;
		if (uploaded.length === 4)
			return pushErrorAlert("You can only have 4 images for one product!");

		reader.onload = () =>
			setUploaded([...uploaded, { url: reader.result, file: files[0] }]);
		reader.readAsDataURL(files[0]);
	};

	// preview images could be uploaded
	const removeUploaded = target => {
		setUploaded(uploaded.filter(({ url }) => url !== target));
	};

	const handleFormChange = ({ target: { name, value } }) => {
		if (name === "categories")
			value = typeof value === "string" ? value.split(",") : value;

		setFormVal({
			...formVal,
			[name]: ["stock", "price", "discount"].includes(name)
				? Number(value)
				: value
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();

		if (!uploaded.length)
			return pushErrorAlert("At least one preview photo is required!");

		try {
			setIsLoading(true);

			// if p.file exists => not uploaded to database
			const uploadQueue = [];
			uploaded.forEach(p => {
				if (p.file) uploadQueue.push(client.uploadImage(p.file));
			});

			// put those uploaded photos from browser to db
			const preview_refs = await Promise.all(uploadQueue);
			const previews = preview_refs.map(p => ({
				_type: "image",
				_key: v4(),
				url: client.getImageURL(p._id),
				asset: {
					_type: "reference",
					_ref: p._id
				}
			}));

			if (action === "create") {
				await client.createProduct({
					...formVal,
					previews,
					_type: "product"
				});
			} else {
				const previewsInUse = currentProduct.previews.filter(p =>
					uploaded.map(({ url }) => url).includes(p.url)
				);
				await client.updateProduct(currentProduct._id, {
					...formVal,
					_type: "product",
					previews: [...previewsInUse, ...previews]
				});
			}

			pushSuccessAlert("Product was successfully created/modified!");
		} catch (error) {
			console.log(error);
			pushErrorAlert("The process is failed!");
		} finally {
			setIsLoading(false);
			handleClose();
			fetchProducts();
		}
	};

	useEffect(() => {
		if (open) {
			// set form values according to the fetched document
			if (currentProduct && action === "edit") {
				const values = Object.keys(formVal).reduce((prev, k) => {
					prev[k] = currentProduct[k];
					return prev;
				}, {});
				setFormVal(values);

				// fetch the previews images & generate file object beforehand
				setUploaded(currentProduct.previews.map(({ url }) => ({ url })));
			}

			try {
				(async () => {
					// getting all the categories in the dataset
					const results = await client.getProductCategories();
					const categories = Array.from(
						new Set(results.reduce((prev, r) => [...prev, ...r.categories], []))
					);

					setAvailableCats(categories);
				})();
			} catch (error) {
				pushErrorAlert("Service is not available!");
			}
		} else {
			setFormVal(initialFormVal);
			setUploaded([]);
		}
	}, [open]);

	return (
		<Modal open={open} handleClose={handleClose} isLoading={isLoading}>
			<Typography
				variant="h6"
				style={{ margin: "1.5rem", marginLeft: ".5rem" }}
			>
				Add new product
			</Typography>
			<form
				onSubmit={e => handleSubmit(e)}
				className="flex flex-col justify-center items-center md:items-stretch md:flex-row md:justify-evenly w-full mx-auto flex-wrap"
			>
				<div className="w-[300px] h-[300px] mb-4 md:mb-0 md:h-[330px] relative">
					{uploaded.map((u, index) => (
						<div
							className="w-32 absolute top-0 group"
							key={`img-${index}`}
							style={{
								left: `${index * 15}%`
							}}
						>
							<button
								type="button"
								className="absolute right-0 group-hover:z-999 rounded-full bg-white"
								onClick={() => removeUploaded(u.url)}
							>
								<XIcon className="w-5 h-5" />
							</button>
							<img
								src={u.url}
								alt="preview of uploaded images"
								className="absolute rounded-md w-32 top-0 outline outline-2 outline-color-white hover:outline-color-primary-light shadow-md group-hover:z-998"
							/>
						</div>
					))}
					<button
						type="button"
						className="mb-4 md:mb-0 p-2 border-dashed border-2 flex items-center justify-center text-color-secondary-light w-full h-full"
						onClick={() => uploader.current && uploader.current.click()}
					>
						<PhotographIcon className="w-9 h-9 mx-2" />
						<span>
							Add Images (max. 4) <br />
						</span>
					</button>
				</div>

				<div className="flex flex-col justify-between  w-[300px] h-[330px]">
					<input
						type="file"
						className="hidden"
						accept="image/*"
						ref={uploader}
						onChange={e => createDataURL(e)}
					/>
					<FormControl>
						<InputLabel>Categories</InputLabel>
						<Select
							required
							name="categories"
							multiple
							value={formVal.categories}
							label="product categories"
							onChange={e => handleFormChange(e)}
						>
							{availableCats.map((cat, index) => (
								<MenuItem key={`option-${index}`} value={cat}>
									{cat}
								</MenuItem>
							))}
							<MenuItem>
								<input
									className="w-full"
									type="text"
									placeholder="(Enter new category here)"
									onKeyDown={e => {
										if (e.key === "Enter") {
											setAvailableCats([...availableCats, e.target.value]);
											e.target.value = "";
										}
									}}
								/>
							</MenuItem>
						</Select>
					</FormControl>
					{placeHolders.map(({ placeholder, field }, index) => (
						<input
							key={`input-${index}`}
							name={field}
							min="0"
							type={
								["stock", "price", "discount"].includes(field)
									? "number"
									: "text"
							}
							max={field === "discount" ? "1" : null}
							step={["discount", "price"].includes(field) ? ".01" : null}
							className="p-2 border-2 rounded-md focus:outline-color-primary-light"
							placeholder={placeholder}
							onChange={e => handleFormChange(e)}
							value={formVal[field]}
							required
						/>
					))}
				</div>
				<div className="basis-full text-right mt-8">
					<TextButton text="Submit" />
				</div>
			</form>
		</Modal>
	);
};

export default ProductForm;
