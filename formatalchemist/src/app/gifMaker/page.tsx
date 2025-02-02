"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Fragment, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { Download } from "lucide-react";
import { toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import GifGenerator from "../components/GifGenerator";

const steps = ["Upload item", "Create gif", "Download the file"];

const GifMaker: React.FC = () => {
	const ffmpegRef = useRef<FFmpeg>(null);
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
		const imageExtensions = ["png", "jpg"];
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
			setAlertMessage("Unsupported file type!");
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
				<CircularProgress color="success" className="w-full h-screen" />
			) : (
				<div className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-screen">
					<Stepper activeStep={activeStep}>
						{steps.map((label, index) => (
							<Step key={index}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					<div className="w-full h-full">
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
											className="bg-slate-200 w-full hover:cursor-pointer border-dashed border-2 h-2/3 shadow-xl sm:m-10 my-4 rounded-lg flex justify-center items-center">
											<p>Drag `n` drop, or Click to select files</p>
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
									<div className="w-1/2 h-1/4 flex flex-col rounded-lg border-2 items-center justify-center">
										<p>
											{!isImageUpload && files[0]?.name
												? `${files[0].name.substring(0, files[0].name.lastIndexOf("."))}.gif`
												: "output.gif"}
										</p>
										{downloadFile && (
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
										)}
									</div>
									<div className="flex flex-row justify-evenly mt-10 w-full">
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
											{activeStep === steps.length - 1 ? "Finish" : "Next"}
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
				</div>
			)}
		</div>
	);
};

export default GifMaker;
