"use client";
import React, { Fragment, useState } from "react";
import Container from "../components/Container";
import { Alert, Step, StepLabel, Stepper } from "@mui/material";
import Dropzone from "react-dropzone";
import { CirclePlus, Download } from "lucide-react";
const steps = ["Upload JPEG image", "See and download the corrupt image"];

const JpegCorruptor = () => {
	const [corruptedUrl, setCorruptedUrl] = useState("");
	const [activeStep, setActiveStep] = useState<number>(0);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);

	const handleFileChange = async (acceptedFiles: File[]) => {
		if (
			acceptedFiles &&
			acceptedFiles[0] &&
			acceptedFiles[0]?.size > 20971520
		) {
			setAlertMessage(
				"File size exceeds the 20 MB limit. Please upload a smaller file."
			);

			setTimeout(() => {
				setAlertMessage(null);
			}, 5000);
			return;
		}

		const extension = acceptedFiles[0].name
			.slice(acceptedFiles[0].name.lastIndexOf(".") + 1)
			.toLowerCase();

		if (extension !== "jpeg" && extension !== "jpg") {
			setAlertMessage("Unsopported file type!");
			setTimeout(() => setAlertMessage(null), 3000);
			return;
		}

		try {
			// Step 1: Create an <img> from the file
			const objectUrl = URL.createObjectURL(acceptedFiles[0]);
			const img = new Image();
			img.src = objectUrl;

			img.onload = () => {
				// Step 2: Draw onto a hidden canvas
				const canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					alert("Failed to get canvas context");
					return;
				}
				ctx.drawImage(img, 0, 0);

				// Step 3: Re-encode at very low JPEG quality (e.g. 0.05)
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							alert("Failed to re-encode image");
							return;
						}

						// Step 4: Create a new URL for the “blocky” JPEG
						const lowQualUrl = URL.createObjectURL(blob);
						setCorruptedUrl(lowQualUrl);
						setActiveStep(1);

						// Revoke the original URL; we only need the new one
						URL.revokeObjectURL(objectUrl);
					},
					"image/jpeg",
					0.0000001 // 0000001% quality → intense 8×8 artifacts
				);
			};

			img.onerror = () => {
				alert("Could not load image for processing");
			};
		} catch (err) {
			console.error("Error processing image:", err);
			alert("Something went wrong while creating artifacts.");
		}
	};

	return (
		<div className="flex items-center justify-center w-full h-full overflow-y-auto">
			<Container className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-full">
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => {
						const stepProps: { completed?: boolean } = {};
						const labelProps: {
							optional?: React.ReactNode;
						} = {};
						return (
							<Step key={index} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<div className="w-full h-full ">
					{activeStep === 0 && (
						<Fragment>
							<Dropzone
								onDrop={(acceptedFiles) => {
									handleFileChange(acceptedFiles);
								}}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="bg-transparent w-full hover:cursor-pointer  h-2/3  sm:m-10 my-4 rounded-lg flex justify-center items-center">
										<div className=" w-1/2 h-1/2 flex flex-col items-center justify-center">
											<CirclePlus
												className="w-full h-full sm:max-h-64 sm:max-w-64"
												color="#BADEFF"
											/>
											<p>Add your files here</p>
										</div>
										<input type="file" hidden {...getInputProps()} />
									</div>
								)}
							</Dropzone>
						</Fragment>
					)}
					{corruptedUrl !== "" && (
						<Fragment>
							<div className="items-center justify-center h-full w-full flex flex-col">
								<h2>Corrupted Image:</h2>
								<img
									src={corruptedUrl}
									alt="Low quality blocky JPEG"
									className="max-w-full max-h-64 border border-gray-300 mb-4"
								/>
								<a
									href={corruptedUrl}
									download={`artifacts.jpg`}
									className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 items-center justify-center flex">
									Download
									<Download className="pl-2 w-1/2" />
								</a>
							</div>
						</Fragment>
					)}
					{alertMessage && (
						<Alert severity="error" onClose={() => setAlertMessage(null)}>
							{alertMessage}
						</Alert>
					)}
				</div>
			</Container>
		</div>
	);
};

export default JpegCorruptor;
