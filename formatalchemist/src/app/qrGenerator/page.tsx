"use client";

import { useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";

type UploadStatus = "idle" | "uploading" | "done";
const steps = ["Upload item", "Create gif", "Download the file"];

const QrGenerator: React.FC = () => {
	const searchParams = useSearchParams();

	const gifUrl = searchParams.get("gifUrl");
	const router = useRouter();

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
	const [activeStep, setActiveStep] = useState<number>(0);

	useEffect(() => {
		if (gifUrl && typeof gifUrl === "string") {
			setFileUrl(gifUrl);
			setActiveStep(1);
		}
	}, [gifUrl]);

	const uploadFile = async (files: File[]) => {
		const file = files[0];
		const localPreviewUrl = URL.createObjectURL(file);
		setPreviewUrl(localPreviewUrl);
		setUploadStatus("uploading");
		const formData = new FormData();
		formData.append("file", file, file.name);

		try {
			const response = await fetch("/api/items", {
				method: "POST",
				body: formData,
			});
			if (response.ok) {
				const data = await response.json();
				setFileUrl(data.url);
				setUploadStatus("done");
				handleNext();
			} else {
				const data = await response.status;

				console.error("Upload failed.", data);
			}
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	const handleBack = () => {
		if (activeStep === steps.length - 1) {
			setFileUrl(null);
		}
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleNext = () => {
		if (fileUrl && activeStep === steps.length - 1) {
			router.push(fileUrl);
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};
	const downloadImage = (type: "png" | "jpeg" = "png") => {
		const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
		if (!canvas) {
			console.error("QR code canvas not found");
			return;
		}

		const mimeType = type === "jpeg" ? "image/jpeg" : "image/png";
		const dataURL = canvas.toDataURL(mimeType);
		const link = document.createElement("a");
		link.href = dataURL;
		link.download = `qr-code.${type}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="flex items-center justify-center ">
			<div className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-screen">
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => (
						<Step key={index}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{/* Step 1: File Upload (if fileUrl not already set) */}
				{activeStep === 0 && uploadStatus === "uploading" && (
					<CircularProgress color="success" className="w-full h-full" />
				)}
				{activeStep === 0 && uploadStatus === "idle" && (
					<Fragment>
						<Dropzone onDrop={(acceptedFiles) => uploadFile(acceptedFiles)}>
							{({ getRootProps, getInputProps }) => (
								<div
									{...getRootProps({
										onClick: (e) => e.preventDefault(),
										onKeyDown: (e) => e.preventDefault(),
									})}
									className="bg-slate-200 w-full hover:cursor-pointer border-dashed border-2 h-2/3 shadow-xl sm:m-10 my-4 rounded-lg flex justify-center items-center">
									<p>Drag `n` drop, or Click to select files</p>
									<input type="file" hidden {...getInputProps()} />
								</div>
							)}
						</Dropzone>
					</Fragment>
				)}
				{/* Step 2: Review Uploaded File */}
				{fileUrl && activeStep === 1 && (
					<div className="mb-6 items-center flex flex-col w-full justify-center">
						<h1 className="mb-2 font-sofiaMedium">Your file</h1>
						<img
							src={previewUrl || ""}
							alt="Uploaded file preview"
							className="w-full max-w-md border mb-4"
						/>
					</div>
				)}

				{/* Step 3: Generate QR Code */}
				{fileUrl && activeStep === steps.length - 1 && (
					<div className="flex flex-col items-center p-10">
						<p className="mb-4">Scan this QR code to view your file:</p>
						<QRCodeCanvas id="qr-code" value={fileUrl} size={256} />
						<button
							onClick={() => downloadImage("png")}
							className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
							Download QR Code SVG
						</button>
					</div>
				)}
				{activeStep !== 0 && (
					<div className="flex flex-row justify-evenly sm:mt-14 w-full">
						<button
							onClick={handleBack}
							type="button"
							className="bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500  p-4 rounded-lg">
							Back
						</button>
						<button
							onClick={handleNext}
							type="button"
							className="bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500  p-4 rounded-lg">
							{fileUrl && activeStep === steps.length - 1
								? "View File"
								: "QR Codify"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

function QrGeneratorPage() {
	return (
		<Suspense fallback={<div>Loading QR Generator...</div>}>
			<QrGenerator />
		</Suspense>
	);
}
export default QrGeneratorPage;
