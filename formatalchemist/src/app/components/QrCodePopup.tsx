// app/items/QrCodePopupClient.tsx (Client Component)
"use client";

import { useState, useEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

export default function QrCodePopup() {
	const [open, setOpen] = useState(false);
	const [currentUrl, setCurrentUrl] = useState<string>("");

	useEffect(() => {
		setCurrentUrl(window.location.href);
	}, []);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div className="mt-4">
			<Button
				variant="contained"
				onClick={handleOpen}
				className="rounded-md bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500  p-2  px-3.5 py-2.5 text-sm font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
				Show QR Code
			</Button>
			<Modal open={open} onClose={handleClose}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						textAlign: "center",
					}}>
					{currentUrl ? (
						<QRCodeCanvas id="qr-code" value={currentUrl} size={256} />
					) : (
						"Loading..."
					)}
					<Button onClick={handleClose} sx={{ mt: 2 }} variant="outlined">
						Close
					</Button>
				</Box>
			</Modal>
		</div>
	);
}
