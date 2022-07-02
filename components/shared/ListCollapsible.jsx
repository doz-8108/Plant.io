import React, { useState } from "react";
import {
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	Button
} from "@mui/material";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/outline";

const Row = ({ rowContent, collapsibleContent }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<ChevronUpIcon className="h-5 w-5" />
						) : (
							<ChevronDownIcon className="h-5 w-5" />
						)}
					</IconButton>
				</TableCell>
				{Object.keys(rowContent).map(k => (
					<TableCell key={`content-${k}`}>{rowContent[k]}</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>{collapsibleContent}</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

const ListCollapsible = ({ rows, header }) => {
	const [page, setPage] = useState(0);

	return (
		<>
			<TableContainer component={Paper}>
				<Table aria-label="Table of new comments waiting for approval">
					<TableHead>
						<TableRow>
							<TableCell />
							{header.map(col => (
								<TableCell key={`header-${col}`}>{col}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.slice(page * 5, page * 5 + 5).map((row, index) => (
							<Row key={`row-${index}`} {...row} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5]}
				component="div"
				count={rows.length}
				rowsPerPage={5}
				onPageChange={(_, newPage) => setPage(newPage)}
				page={page}
			/>
		</>
	);
};

export default ListCollapsible;
