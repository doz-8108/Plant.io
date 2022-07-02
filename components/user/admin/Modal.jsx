import React from "react";
import { Box, CircularProgress, Modal, useMediaQuery } from "@mui/material";

const OnCreateModal = ({ open, handleClose, isLoading, children }) => {
	const isLandscape = useMediaQuery("(min-width: 1024px)");

	return (
		<Modal
			open={open}
			onClose={isLoading ? () => {} : handleClose}
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			{isLoading ? (
				<CircularProgress sx={{ color: "var(--color-primary)" }} />
			) : (
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						backgroundColor: "#fff",
						padding: isLandscape ? "2rem" : "1rem",
						borderRadius: "5px",
						width: isLandscape ? "800px" : "90%",
						overflowY: "scroll",
						maxHeight: "70vh"
					}}
				>
					{children}
				</Box>
			)}
		</Modal>
	);
};

export default OnCreateModal;
