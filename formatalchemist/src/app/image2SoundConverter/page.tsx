"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { CirclePlus } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import Container from "../components/Container";

const steps = ["Upload Image", "Download Sound"];

const Image2SoundConverter: React.FC = () => {
	const ffmpegRef = useRef<FFmpeg>(new FFmpeg());
	const [activeStep, setActiveStep] = useState<number>(0);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [audioUrl, setAudioUrl] = useState<string>("");
	const [loaded, setLoaded] = useState<boolean>(false);
	const [isProcessing, setIsProcessing] = useState(false);

	// Audio parameters
	const SAMPLE_RATE = 22050;

	useEffect(() => {
		const loadFFmpeg = async () => {
			try {
				await ffmpegRef.current.load({
					coreURL: "/ffmpeg/ffmpeg-core.js",
					wasmURL: "/ffmpeg/ffmpeg-core.wasm",
				});
				setLoaded(true);
			} catch (error) {
				console.error("FFmpeg load error:", error);
				setAlertMessage("Failed to initialize audio processor");
			}
		};
		loadFFmpeg();
	}, []);
	const processImageToAudio = async (imageFile: File) => {
		if (!loaded) {
			setAlertMessage("Audio processor not ready");
			return;
		}

		setIsProcessing(true);
		try {
			console.log("inside the proces Image");

			// Load and draw image
			const image = new Image();
			image.src = URL.createObjectURL(imageFile);
			await new Promise((r) => (image.onload = r));

			const canvas = document.createElement("canvas");
			// you can downsample here if you want smaller audio
			canvas.width = image.width;
			canvas.height = image.height;
			const ctx = canvas.getContext("2d")!;
			console.log("drawing");
			ctx.drawImage(image, 0, 0);

			// 2) Grab raw pixel bytes
			const { data: pixelBytes } = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);
			console.log("read the pixels");

			// 3) Build a PCM buffer directly from those bytes
			//    We’ll map 0–255 → -32767…+32767 (signed 16-bit PCM)
			const pcmBuffer = new Int16Array(canvas.width * canvas.height);
			for (let i = 0; i < pcmBuffer.length; i++) {
				const byteVal = pixelBytes[i * 4]; // red channel
				const signed = (byteVal / 255) * 2 - 1; // -1 .. +1
				pcmBuffer[i] = Math.round(signed * 32767); // PCM16
			}
			console.log("wrapped to buffer");

			// 4) Write & encode with FFmpeg
			await ffmpegRef.current.writeFile(
				"input.pcm",
				new Uint8Array(pcmBuffer.buffer)
			);
			await ffmpegRef.current.exec([
				"-f",
				"s16le", // signed 16-bit little endian
				"-ar",
				SAMPLE_RATE.toString(),
				"-ac",
				"1",
				"-i",
				"input.pcm",
				"output.wav",
			]);
			console.log("converted the wav file ");
			const wavData = await ffmpegRef.current.readFile("output.wav");
			const blob = new Blob([wavData], { type: "audio/wav" });
			setAudioUrl(URL.createObjectURL(blob));
			console.log("here we are");
		} catch (error) {
			console.error("Processing error:", error);
			setAlertMessage("Audio generation failed");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleFileUpload = (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 0) return;

		const file = acceptedFiles[0];
		console.log("file", file);
		if (!file.type.startsWith("image/")) {
			setAlertMessage("Please upload an image file");
			return;
		}

		processImageToAudio(file);
		setActiveStep(1);
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
		if (activeStep === steps.length - 1) setAudioUrl("");
	};

	return (
		<div className="flex items-center justify-center w-full h-full overflow-y-auto py-5">
			{!loaded ? (
				<div className="fixed inset-0 flex items-center justify-center">
					<CircularProgress color="success" className="w-12 h-12" />
				</div>
			) : (
				<Container className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-full">
					<Stepper activeStep={activeStep}>
						{steps.map((label, index) => (
							<Step key={index}>
								<StepLabel className="text-gray-200" color="#BADEFF">
									{label}
								</StepLabel>
							</Step>
						))}
					</Stepper>

					{activeStep === 0 && (
						<Dropzone
							onDrop={handleFileUpload}
							accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
							maxSize={20 * 1024 * 1024}>
							{({ getRootProps, getInputProps }) => (
								<div
									{...getRootProps()}
									className="bg-transparent w-full h-2/3 sm:m-10 my-4 rounded-lg 
                             flex justify-center items-center hover:cursor-pointer">
									<div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
										<CirclePlus
											className="w-full h-full sm:max-h-64 sm:max-w-64"
											color="#BADEFF"
										/>{" "}
										<p className="text-sm text-gray-400">
											Add your image file here (PNG, JPG up to 20MB)
										</p>
									</div>
									<input {...getInputProps()} />
								</div>
							)}
						</Dropzone>
					)}
					{isProcessing && (
						<div className="fixed inset-0 flex items-center justify-center">
							<CircularProgress color="success" className="w-12 h-12" />
						</div>
					)}
					{activeStep === 1 && !isProcessing && (
						<div className="flex flex-col items-center justify-center h-full">
							{audioUrl && (
								<div className="mb-8 mt-8 w-full max-w-md items-center justify-center">
									<audio controls className="w-full ">
										<source src={audioUrl} type="audio/wav" />
										Your browser does not support the audio element.
									</audio>
								</div>
							)}
							<button
								onClick={handleBack}
								className="mt-8 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
								Back
							</button>
						</div>
					)}

					{alertMessage && (
						<Alert
							severity="error"
							onClose={() => setAlertMessage(null)}
							className="mt-4">
							{alertMessage}
						</Alert>
					)}
				</Container>
			)}
		</div>
	);
};

export default Image2SoundConverter;
