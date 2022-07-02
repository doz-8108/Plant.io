import react, { useState } from "react";
import { Typography, Button } from "@mui/material";

import dayjs from "dayjs";
import Modal from "./Modal";
import client from "../../../utils/sanity.client";
import ListCollapsible from "../../shared/ListCollapsible";

const header = ["User ID", "User Name", "Product ID", "Product Name"];
const CollapsibleCotent = ({
	date,
	comment,
	commentId,
	productId,
	rating,
	removeRow
}) => {
	const publishComment = () => {
		client.publishComment(commentId, productId, rating);
		removeRow(commentId);
	};
	const deleteComment = () => {
		client.deleteComment(commentId);
		removeRow(commentId);
	};

	return (
		<>
			<p className="my-2">{dayjs(date).format("YYYY-MM-DD hh:mm:ss")}</p>
			<p>{comment}</p>
			<div className="mt-2 text-right">
				<Button
					style={{ color: "var(--color-primary)" }}
					onClick={publishComment}
				>
					Approve
				</Button>
				<Button style={{ color: "red" }} onClick={deleteComment}>
					Delete
				</Button>
			</div>
		</>
	);
};

const NewComments = ({ handleClose, open, comments }) => {
	const [rowState, setRowState] = useState(comments);
	const removeRow = commentId =>
		setRowState(rowState.filter(r => r._id !== commentId));

	const rows = rowState.map(r => ({
		rowContent: {
			userId: r.user._id,
			userName: `${r.user.firstName} ${r.user.lastName}`,
			productId: r.product._id,
			productName: r.product.productName
		},
		collapsibleContent: (
			<CollapsibleCotent
				comment={r.content}
				date={r.date}
				commentId={r._id}
				productId={r.product._id}
				rating={r.rating}
				removeRow={removeRow}
			/>
		)
	}));

	return (
		<Modal open={open} handleClose={handleClose}>
			<Typography
				id="modal-modal-title"
				variant="h5"
				component="h2"
				style={{ marginBottom: "1rem" }}
			>
				Latest Comments
			</Typography>
			<ListCollapsible rows={rows} header={header} />
		</Modal>
	);
};

export default NewComments;
