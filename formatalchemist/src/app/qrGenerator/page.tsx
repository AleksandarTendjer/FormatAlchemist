"use client";

import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import Dropzone from "react-dropzone";

type UploadStatus = "idle" | "uploading" | "done";
const steps = ["Upload item", "Create gif", "Download the file"];

const QrGenerator: React.FC = () => {
	const searchParams = useSearchParams();

	const gifUrl = searchParams.get("gifUrl");

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
	const [activeStep, setActiveStep] = useState<number>(0);

	// If gifUrl is provided in the query, set it immediately.
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
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	return (
		<div className="flex items-center justify-center">
			<div className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-screen">
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => (
						<Step key={index}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				<div className="w-full h-full">
					{/* Step 1: File Upload (if fileUrl not already set) */}
					{activeStep === 0 && uploadStatus === "uploading" && (
						<CircularProgress color="success" className="w-full h-screen" />
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
						<div className="mb-6 items-center flex flex-col w-full h-full justify-center">
							<h1 className="mb-2 font-sofiaMedium">Your file</h1>
							<img
								src={previewUrl}
								alt="Uploaded file preview"
								className="w-full max-w-md border mb-4"
							/>
						</div>
					)}

					{/* Step 3: Generate QR Code */}
					{fileUrl && activeStep === steps.length - 1 && (
						<div className="flex flex-col items-center">
							<p className="mb-4">Scan this QR code to view your file:</p>
							<QRCodeSVG value={fileUrl} size={256} />
							<p className="mt-4">
								<a
									href={fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 underline">
									View your file
								</a>
							</p>
						</div>
					)}
				</div>
				{activeStep !== 0 && (
					<div className="flex flex-row justify-evenly mt-14 w-full">
						<button
							onClick={handleBack}
							type="button"
							className="bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:bg-blue-700 p-4 rounded-lg">
							Back
						</button>
						<button
							onClick={handleNext}
							type="button"
							className="bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:bg-blue-700 p-4 rounded-lg">
							QR Codify
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default QrGenerator;
