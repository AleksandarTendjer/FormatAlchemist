"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Fragment, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { Download } from "lucide-react";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import RangeSlider from "../components/RangeSlider";
//const { FFmpeg } = await import("@ffmpeg/ffmpeg");
const steps = ["Upload item", "Create gif", "Downloiad the file"];

const GifMaker: React.FC = () => {
	const ffmpegRef = useRef<FFmpeg>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	const [file, setFile] = useState<File | null>(null);
	const [possibleConversions, setPossibleConversions] = useState<
		string[] | null
	>();
	const [activeStep, setActiveStep] = useState<number>(0);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [downloadFile, setDownloadFile] = useState<Blob | null>(null);
	const [loaded, setLoaded] = useState(false);
	const messageRef = useRef<HTMLParagraphElement | null>(null);
	const [from, setFrom] = useState<number>(0); // Start time
	const [to, setTo] = useState<number>(2.5); // End time
	const [duration, setDuration] = useState<number>(0);
	const [metadataLoaded, setMetadataLoaded] = useState(false);

	const supportedConversions: Record<string, string[]> = {
		avi: ["gif"],
		mp4: ["gif"],
	};

	useEffect(() => {
		load();
	}, []);

	const load = async () => {
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
		const ffmpeg = new FFmpeg();

		//const ffmpeg = ffmpegRef.current;

		ffmpeg.on("log", ({ message }) => {
			if (messageRef.current) messageRef.current.innerHTML = message;
		});
		// toBlobURL is used to bypass CORS issue, urls with the same
		// domain can be used directly.
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
	const handleSliderChange = (newFrom: number, newTo: number) => {
		setFrom(newFrom);
		setTo(newTo);
	};

	const handleMakeGif = async () => {
		if (!ffmpegRef.current) {
			setAlertMessage("FFmpeg is not loaded yet!");
			return;
		}
		if (!file) {
			setAlertMessage("No file selected!");
			setTimeout(() => setAlertMessage(null), 3000);
			return;
		}
		try {
			const ffmpeg = ffmpegRef.current;
			const fileName = file.name;
			const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);

			const inputFileName = `input.${fileExtension}`;
			const outputFileName = "output.gif";

			await ffmpeg.writeFile(`input.${fileExtension}`, await fetchFile(file));

			await ffmpeg.exec([
				"-i",
				inputFileName,
				"-t",
				(to - from).toString(),
				"-ss",
				from.toString(),
				"-f",
				"gif",
				outputFileName,
			]);

			const fileData = await ffmpeg.readFile(outputFileName);

			const gifBlob = new Blob([fileData], {
				type: "image/gif",
			});
			setDownloadFile(gifBlob);

			handleNext();
		} catch (error) {
			console.error("Error creating GIF:", error);
			setAlertMessage("Failed to create GIF. Please try again.");
			setTimeout(() => setAlertMessage(null), 5000);
		}
	};

	const handleFileUpload = (acceptedFiles: File[]) => {
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

		if (!supportedConversions[extension]) {
			setAlertMessage("Unsopported file type!");
			setTimeout(() => setAlertMessage(null), 3000);
			return;
		}
		setPossibleConversions(supportedConversions[extension]);
		setFile(acceptedFiles[0]);
		handleNext();
	};

	const handleBack = () => {
		if (activeStep === 2) setDownloadFile(null);
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
										handleFileUpload(acceptedFiles);
									}}>
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
						{activeStep == 1 && file && (
							<Fragment>
								<div className="items-center justify-center h-full w-full flex flex-col">
									<div className="w-1/2">
										{file && (
											<>
												<video
													ref={videoRef}
													className="w-full max-w-lg"
													src={URL.createObjectURL(file)}
													onLoadedMetadata={() => {
														if (!metadataLoaded) {
															const videoDuration =
																videoRef.current?.duration || 0;
															setDuration(videoDuration);
															setTo(Math.min(2.5, videoDuration));
															setMetadataLoaded(true);
														}
													}}
												/>
												<RangeSlider
													duration={duration}
													from={from}
													to={to}
													onSliderChange={handleSliderChange}
													key={"timelineKey"}
												/>
												<button
													onClick={handleMakeGif}
													type="button"
													className="mt-4 bg-blue-500 text-white p-2 rounded">
													Create GIF
												</button>
											</>
										)}
									</div>
									<div className="flex flex-row justify-evenly mt-10 w-full">
										<button
											onClick={handleBack}
											type="button"
											className=" bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:bg-blue-700 p-4 rounded-lg ">
											Back
										</button>
										<button
											onClick={() => {
												handleNext();
											}}
											type="button"
											className="   bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:bg-blue-700 p-4  rounded-lg">
											{activeStep === steps.length - 1 ? "Finish" : "Next"}
										</button>
									</div>
								</div>
							</Fragment>
						)}
						{activeStep === steps.length - 1 && (
							<Fragment>
								<div className="items-center justify-center h-full w-full flex flex-col">
									<div className="w-1/2 h-1/4 flex flex-col rounded-lg border-2  items-center justify-center">
										<p>
											{file?.name
												? `${file.name.substring(0, file.name.lastIndexOf("."))}.gif`
												: ""}
										</p>

										{downloadFile && (
											<a
												href={URL.createObjectURL(downloadFile)}
												download={`${file?.name.substring(0, file?.name.lastIndexOf("."))}.gif`}
												className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 items-center justify-center flex">
												Download
												<Download className="pl-2 w-1/2" />
											</a>
										)}
									</div>
									<div className="flex flex-row justify-evenly mt-10 w-full">
										<button
											onClick={handleBack}
											type="button"
											className=" bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:bg-blue-700 p-4 rounded-lg ">
											Back
										</button>
										<button
											onClick={() => {
												handleNext();
											}}
											type="button"
											className="   bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:bg-blue-700 p-4  rounded-lg">
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
