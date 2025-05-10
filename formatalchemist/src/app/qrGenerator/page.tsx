"use client";

import { useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import { CirclePlus } from "lucide-react";
import Container from "../components/Container";

type UploadStatus = "idle" | "uploading" | "done";
const steps = ["Upload file", "Review uploaded file", "Review the QR Code"];

const QrGenerator: React.FC = () => {
	const searchParams = useSearchParams();
	const [alertMessage, setAlertMessage] = useState<string | null>(null);

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
		if (file.size > 5000000) {
			setAlertMessage("Maximum file size is 5 MB!");
			setTimeout(() => setAlertMessage(null), 3000);

			return;
		}
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
			router.push(`items/${fileUrl}`);
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
		<div className="flex items-center justify-center w-full h-full overflow-y-auto py-5">
			<Container className="flex flex-col sm:py-10 w-full md:w-2/3 mx-2 h-full ">
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => (
						<Step key={index}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{/* Step 1: File Upload (if fileUrl not already set) */}
				{activeStep === 0 && uploadStatus === "uploading" && (
					<div className="fixed inset-0 flex items-center justify-center ">
						<CircularProgress color="success" className="w-12 h-12" />
					</div>
				)}
				{activeStep === 0 &&
					(uploadStatus === "idle" || uploadStatus === "done") && (
						<Fragment>
							<Dropzone onDrop={(acceptedFiles) => uploadFile(acceptedFiles)}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps({
											onClick: (e) => e.preventDefault(),
											onKeyDown: (e) => e.preventDefault(),
										})}
										className="bg-transparent w-full hover:cursor-pointer  h-2/3 sm:m-10 my-4 rounded-lg flex justify-center items-center">
										<div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
											<CirclePlus
												className="w-full h-full sm:max-h-64 sm:max-w-64"
												color="#BADEFF"
											/>
											<p>Add your files here</p>
										</div>{" "}
										<input type="file" hidden {...getInputProps()} />
									</div>
								)}
							</Dropzone>
							{alertMessage && (
								<Alert
									className="my-5"
									severity="error"
									onClose={() => setAlertMessage(null)}>
									{alertMessage}
								</Alert>
							)}
						</Fragment>
					)}
				{/* Step 2: Review Uploaded File */}
				{fileUrl && activeStep === 1 && (
					<div className="mb-6 sm:mt-4 items-center flex flex-col w-full justify-center">
						<img
							src={previewUrl || ""}
							alt="Uploaded file preview"
							className="w-full max-w-md border mb-4"
						/>
					</div>
				)}

				{/* Step 3: Generate QR Code */}
				{fileUrl && activeStep === steps.length - 1 && (
					<div className="relative group inline-block cursor-pointer juftify-center items-center p-10">
						<QRCodeCanvas id="qr-code" value={fileUrl} size={256} />
						<div
							className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg"
							onClick={() => downloadImage("png")}>
							<span className="text-white text-lg font-medium">
								Click to Download
							</span>
						</div>
					</div>
				)}
				{activeStep !== 0 && (
					<div className="flex flex-row justify-evenly sm:mt-14 w-full">
						<button
							onClick={handleBack}
							type="button"
							className="bg-[length:200%_100%] 
             animate-gradient-flow bg-gradient-to-br from-slate-200 via-slate-500 to-slate-200 text-slate-100 hover:via-blue-500 p-4 rounded-lg">
							Back
						</button>
						<button
							onClick={handleNext}
							type="button"
							className="  bg-[length:200%_100%] 
             animate-gradient-flow bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500  p-4 rounded-lg">
							{fileUrl && activeStep === steps.length - 1
								? "View File"
								: "QR Codify"}
						</button>
					</div>
				)}
			</Container>
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
