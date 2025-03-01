"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { CirclePlus, Download } from "lucide-react";
import { toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import GifGenerator from "../components/GifGenerator";

const steps = ["Upload files", "Create gif", "Download the file"];

const GifMaker: React.FC = () => {
	const ffmpegRef = useRef<FFmpeg>(null);
	const router = useRouter();

	const [files, setFiles] = useState<File[]>([]);
	const [activeStep, setActiveStep] = useState<number>(0);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [downloadFile, setDownloadFile] = useState<Blob | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [isImageUpload, setIsImageUpload] = useState<boolean>(false);

	useEffect(() => {
		load();
	}, []);

	const load = async () => {
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
		const ffmpeg = new FFmpeg();
		ffmpeg.on("log", ({ message }) => {
			console.log("FFmpeg log:", message);
		});
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(
				`${baseURL}/ffmpeg-core.wasm`,
				"application/wasm"
			),
		});
		ffmpegRef.current = ffmpeg;
		setLoaded(true);
	};

	const handleFileUpload = (acceptedFiles: File[]) => {
		const videoExtensions = ["mp4", "avi"];
		const imageExtensions = ["png", "jpg", "jpeg", "HEIC"];
		const imageFiles: File[] = [];
		let videoFile: File | null = null;
		let totalImageSize = 0;

		for (const file of acceptedFiles) {
			const extension = file.name.split(".").pop()?.toLowerCase();
			if (extension && videoExtensions.includes(extension)) {
				if (!videoFile) {
					videoFile = file;
				}
			} else if (extension && imageExtensions.includes(extension)) {
				totalImageSize += file.size;
				if (totalImageSize <= 20 * 1024 * 1024) {
					imageFiles.push(file);
				}
			}
		}
		if (videoFile) {
			setFiles([videoFile]);
			setIsImageUpload(false);
		} else if (imageFiles.length > 0) {
			setFiles(imageFiles);
			setIsImageUpload(true);
		} else {
			setAlertMessage(
				"Unsupported file type! Must be AVI,MP4,JPG, PNG, JPEG, or HEIC."
			);
			setTimeout(() => setAlertMessage(null), 3000);
			return;
		}

		if (totalImageSize > 20971520 || (videoFile && videoFile.size > 20971520)) {
			setAlertMessage(
				"File size exceeds the 20 MB limit. Please upload a smaller file."
			);
			setTimeout(() => setAlertMessage(null), 5000);
			return;
		}
		handleNext();
	};

	const uploadGifToDatabase = async (gifBlob: Blob) => {
		const formData = new FormData();
		const fileName =
			!isImageUpload && files[0]?.name
				? `${files[0].name.substring(0, files[0].name.lastIndexOf("."))}.gif`
				: "output.gif";
		formData.append("gif", gifBlob, fileName);

		try {
			const response = await fetch("/api/uploadGif", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				router.push(`/qrGenerator?gifUrl=${encodeURIComponent(data.url)}`);
			} else {
				console.error("Upload failed with status", response.status);
			}
		} catch (error) {
			console.error("Error uploading GIF:", error);
		}
	};

	const handleBack = () => {
		if (activeStep === steps.length - 1) {
			setDownloadFile(null);
		}
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	return (
		<div className="flex items-center justify-center">
			{!loaded ? (
				<div className="fixed inset-0 flex items-center justify-center ">
					<CircularProgress color="success" className="w-12 h-12" />
				</div>
			) : (
				<div className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-screen">
					<Stepper activeStep={activeStep}>
						{steps.map((label, index) => (
							<Step key={index}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					{activeStep === 0 && (
						<Fragment>
							<Dropzone
								onDrop={(acceptedFiles) => handleFileUpload(acceptedFiles)}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps({
											onClick: (e) => e.preventDefault(),
											onKeyDown: (e) => e.preventDefault(),
										})}
										className="bg-transparent w-full hover:cursor-pointer  h-2/3  sm:m-10 my-4 rounded-lg flex justify-center items-center">
										<div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
											<CirclePlus className="w-full h-full" color="#BADEFF" />
											<p>Add your files here—drag or click</p>
										</div>
										<input type="file" hidden {...getInputProps()} />
									</div>
								)}
							</Dropzone>
						</Fragment>
					)}
					{activeStep === 1 && (
						<GifGenerator
							ffmpeg={ffmpegRef.current}
							files={files}
							isImageUpload={isImageUpload}
							onGifCreated={(gifBlob: Blob) => {
								setDownloadFile(gifBlob);
								handleNext();
							}}
							onBack={handleBack}
						/>
					)}
					{activeStep === steps.length - 1 && (
						<Fragment>
							<div className="items-center justify-center h-full w-full flex flex-col">
								<div className="w-1/2 h-2/4 flex flex-col rounded-lg border-2 items-center justify-center">
									<p>
										{!isImageUpload && files[0]?.name
											? `${files[0].name.substring(0, files[0].name.lastIndexOf("."))}.gif`
											: "output.gif"}
									</p>
									{downloadFile && (
										<>
											<img
												src={URL.createObjectURL(downloadFile)}
												className="w-full  max-w-md"
											/>
											<a
												href={URL.createObjectURL(downloadFile)}
												download={
													isImageUpload
														? "output.gif"
														: `${files[0]?.name.substring(0, files[0]?.name.lastIndexOf("."))}.gif`
												}
												className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center">
												Download <Download className="pl-2 w-1/2" />
											</a>
										</>
									)}
								</div>
								<div className="flex flex-row justify-evenly mt-14 w-full">
									<button
										onClick={handleBack}
										type="button"
										className="bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500  p-4 rounded-lg">
										Back
									</button>
									<button
										onClick={async () => {
											if (activeStep === steps.length - 1) {
												if (!downloadFile) return;
												await uploadGifToDatabase(downloadFile);
											} else {
												handleNext();
											}
										}}
										type="button"
										className="bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500 p-4 rounded-lg">
										QR Codify
									</button>
								</div>
							</div>
						</Fragment>
					)}

					{alertMessage && (
						<Alert severity="error" onClose={() => setAlertMessage(null)}>
							{alertMessage}
						</Alert>
					)}
				</div>
			)}
		</div>
	);
};

export default GifMaker;
