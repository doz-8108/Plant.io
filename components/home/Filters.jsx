import React, { useState, useRef, useEffect } from "react";
import { SearchIcon, XIcon } from "@heroicons/react/outline";
import { AdjustmentsIcon } from "@heroicons/react/solid";
import {
	FormGroup,
	FormControlLabel,
	Popover,
	Checkbox,
	Box,
	Typography,
	MenuList,
	MenuItem
} from "@mui/material";

const sorting = {
	PRICE_LOW2HIGH: "PRICE_LOW2HIGH",
	PRICE_HIGH2LOW: "PRICE_HIGH2LOW",
	POPULARITY: "POPULARITY"
};

const FilterWidget = ({
	handleSearch,
	categories,
	chosenCats,
    setChosenCats,
    sortBy,
    setSortBy
}) => {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const handlePopoverOpen = () => setPopoverOpen(true);
	const handlePopoverClose = () => setPopoverOpen(false);

	const onSortingSelect = ({ target: { name } }) =>
		setSortBy(sorting[name] === sortBy ? "" : sorting[name]);

	const searchInput = useRef(null);
	const options = useRef(null);

	return (
		<section
			className="mt-10 mb-5 p-5 flex justify-center relative"
			aria-label="filters"
		>
			<div
				className="mr-3 p-2 flex justify-center items-center rounded-3xl bg-color-secondary h-12 w-12 hover:w-11/12 sm:hover:w-4/6 lg:hover:w-3/6 transition-width duration-200 group"
				onMouseOver={() => searchInput.current && searchInput.current.focus()}
				onTouchEnd={() => searchInput.current && searchInput.current.focus()}
				aria-label="search"
				title="search"
			>
				<SearchIcon className="h-6 sm:h-7 text-white" />
				<input
					name="searchKey"
					className="group-hover:w-11/12 group-hover:ml-2 w-0 text-xl outline-none bg-color-secondary cursor-text text-white"
					ref={searchInput}
					onChange={handleSearch}
				/>
			</div>
			<button
				className="ml-3 p-2 rounded-3xl bg-color-primary h-12 w-12 duration-200 group transition-all hover:transform hover:-translate-y-2 hover:shadow-2xl active:-translate-y-1 active:shadow-md"
				aria-label="filters"
				title="filters"
				onClick={handlePopoverOpen}
				ref={options}
			>
				<AdjustmentsIcon className="h-6 sm:h-7 text-color-secondary m-auto" />
			</button>
			<Popover
				anchorEl={options.current}
				open={popoverOpen}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				onClose={handlePopoverClose}
			>
				<Box sx={{ padding: "1rem", position: "relative" }}>
					<button
						className="cursor-pointer rounded-full p-1 hover:bg-slate-50 absolute left-[85%] top-2"
						onClick={handlePopoverClose}
					>
						<XIcon className="w-6 h-6" />
					</button>
					<Typography
						variant="h6"
						sx={{
							fontSize: "1rem",
							paddingBottom: "5px",
							borderBottom: "1px solid #000"
						}}
					>
						Sort by
					</Typography>
					<FormGroup sx={{ paddingBottom: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={sortBy === sorting["POPULARITY"]}
									onChange={onSortingSelect}
									name="POPULARITY"
								/>
							}
							label="Popularity"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={sortBy === sorting["PRICE_HIGH2LOW"]}
									onChange={onSortingSelect}
									name="PRICE_HIGH2LOW"
								/>
							}
							label="Price (From high to Low)"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={sortBy === sorting["PRICE_LOW2HIGH"]}
									onChange={onSortingSelect}
									name="PRICE_LOW2HIGH"
								/>
							}
							label="Price (From Low to high)"
						/>
					</FormGroup>
					<Typography
						variant="h6"
						sx={{
							fontSize: "1rem",
							paddingBottom: "5px",
							borderBottom: "1px solid #000"
						}}
					>
						Categories
					</Typography>
					<MenuList sx={{ maxHeight: "140px", overflowY: "scroll" }}>
						{categories.map(c => (
							<MenuItem
								key={c}
								selected={chosenCats.includes(c)}
								onClick={() =>
									setChosenCats(prev => {
										const isChosen = prev.find(p => p === c);
										if (isChosen) return prev.filter(p => p !== c);

										return [...prev, c];
									})
								}
							>
								{c}
							</MenuItem>
						))}
					</MenuList>
				</Box>
			</Popover>
		</section>
	);
};

export default FilterWidget;
