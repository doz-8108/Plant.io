import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import { SearchIcon, TrashIcon } from "@heroicons/react/outline";

import client from "../../utils/sanity.client";
import useDebounce from "../../hooks/useDebounce";
import { useState } from "react";
import { pushErrorAlert, pushSuccessAlert } from "../../utils/alert";

const List = ({
	list,
	header,
	fetchProducts,
	setAction,
	setCurrentProduct = null,
	handleOpen = null,
	searchMethod
}) => {
	const router = useRouter();
	const path = router.asPath;

	const [selectedIds, setSelectedIds] = useState([]);
	const [search, setSearch] = useState("");
	const debouncedVal = useDebounce(search);

	useEffect(() => {
		searchMethod(search);
	}, [debouncedVal]);

	const handleSeclections = ids => {
		setSelectedIds(ids);
	};

	const deleteSelected = () => {
		if (!selectedIds.length) return pushErrorAlert("No row is selected!");

		client.deleteProduct(selectedIds).then(() => {
			setSelectedIds([]);
			pushSuccessAlert("Delete successfully!");
			fetchProducts();
		});
	};

	const editSelected = data => {
		if (setCurrentProduct && handleOpen) {
			setAction("edit");
			setCurrentProduct(data.row);
			handleOpen();
		}
	};

	return (
		<div className="h-[600px] sm:min-w-[650px]">
			<div className="flex justify-end mb-4">
				{path.includes("products") && (
					<div className="flex items-center mr-auto">
						<button
							className="rounded-md group hover:bg-red-500 mr-2 p-1"
							onClick={deleteSelected}
						>
							<TrashIcon className="w-7 h-7 text-red-500 group-hover:text-white" />
						</button>
					</div>
				)}

				<div className="relative border-2 rounded-md">
					<SearchIcon className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						className="pl-10 py-2 focus:outline-color-primary-light"
						placeholder="Search by name"
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
			</div>
			<DataGrid
				columns={header}
				rows={list}
				pageSize={15}
				hideFooterSelectedRowCount
				checkboxSelection={path.includes("products")}
				onSelectionModelChange={handleSeclections}
				onRowClick={editSelected}
			/>
		</div>
	);
};

export default List;
