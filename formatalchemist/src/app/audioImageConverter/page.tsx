"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useState, useRef, useEffect } from "react";
import Dropzone from "react-dropzone";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { CirclePlus, Download } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import Container from "../components/Container";

const steps = {
	audio: ["Upload Audio", "Download Image"],
	image: ["Upload Image", "Download Sound"],
};

const FileConverter: React.FC = () => {
	const [conversionType, setConversionType] = useState<
		"audio" | "image" | null
	>(null);
	const [activeStep, setActiveStep] = useState(0);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [outputUrl, setOutputUrl] = useState<string>("");
	const [isProcessing, setIsProcessing] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ffmpegRef = useRef<FFmpeg | null>(null);
	const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

	useEffect(() => {
		const loadFFmpeg = async () => {
			try {
				const ffmpeg = new FFmpeg();
				ffmpeg.on("log", ({ message }) => {
					console.log("FFmpeg log:", message);
				});
				await ffmpeg.load({
					coreURL: "/ffmpeg/ffmpeg-core.js",
					wasmURL: "/ffmpeg/ffmpeg-core.wasm",
				});
				ffmpegRef.current = ffmpeg;
				setFfmpegLoaded(true);
			} catch (error) {
				console.error("FFmpeg load error:", error);
				setAlertMessage("Failed to initialize audio processor");
			}
		};
		loadFFmpeg();
	}, []);

	const handleFileUpload = (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 0) return;
		const file = acceptedFiles[0];

		if (file.type.startsWith("audio/")) {
			setConversionType("audio");
			processAudioToImage(file);
		} else if (file.type.startsWith("image/")) {
			setConversionType("image");
			processImageToAudio(file);
		} else {
			setAlertMessage("Unsupported file type");
			return;
		}

		setActiveStep(1);
	};

	const processAudioToImage = async (audio: File) => {
		setIsProcessing(true);
		try {
			const arrayBuffer = await audio.arrayBuffer();
			const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
			const samples = audioBuffer.getChannelData(0);

			const width = 512;
			const height = Math.ceil(samples.length / width);
			const canvas = canvasRef.current!;
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d")!;

			const imgData = ctx.createImageData(width, height);
			for (let i = 0; i < width * height; i++) {
				const sample = samples[i] ?? 0;
				const gray = Math.round((sample * 0.5 + 0.5) * 255);
				imgData.data.set([gray, gray, gray, 255], i * 4);
			}
			ctx.putImageData(imgData, 0, 0);
			setOutputUrl(canvas.toDataURL());
		} catch (err) {
			console.error(err);
			setAlertMessage("Audio processing failed");
			resetState();
		} finally {
			setIsProcessing(false);
		}
	};

	const processImageToAudio = async (image: File) => {
		if (!ffmpegLoaded || !ffmpegRef?.current) {
			setAlertMessage("Audio processor not ready");
			return;
		}

		setIsProcessing(true);
		try {
			const imageBitmap = await createImageBitmap(image);
			const canvas = document.createElement("canvas");
			canvas.width = imageBitmap.width;
			canvas.height = imageBitmap.height;
			const ctx = canvas.getContext("2d")!;
			ctx.drawImage(imageBitmap, 0, 0);

			const { data: pixelData } = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);
			const pcmBuffer = new Int16Array(canvas.width * canvas.height);

			for (let i = 0; i < pcmBuffer.length; i++) {
				const byteVal = pixelData[i * 4];
				const signed = (byteVal / 255) * 2 - 1;
				pcmBuffer[i] = Math.round(signed * 32767);
			}

			await ffmpegRef.current.writeFile(
				"input.pcm",
				new Uint8Array(pcmBuffer.buffer)
			);
			await ffmpegRef.current.exec([
				"-f",
				"s16le",
				"-ar",
				"22050",
				"-ac",
				"1",
				"-i",
				"input.pcm",
				"output.wav",
			]);

			const wavData = await ffmpegRef.current.readFile("output.wav");
			setOutputUrl(
				URL.createObjectURL(new Blob([wavData], { type: "audio/wav" }))
			);
		} catch (error) {
			console.error("Processing error:", error);
			setAlertMessage("Audio generation failed");
			resetState();
		} finally {
			setIsProcessing(false);
		}
	};

	const resetState = () => {
		setActiveStep(0);
		setConversionType(null);
		setOutputUrl("");
	};

	return (
		<div className="flex items-center justify-center w-full h-full overflow-y-auto py-5">
			<Container className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-full">
				<Stepper activeStep={activeStep} className="mb-6">
					{conversionType &&
						steps[conversionType].map((label, idx) => (
							<Step key={idx}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
				</Stepper>

				{activeStep === 0 ? (
					<Dropzone
						onDrop={handleFileUpload}
						accept={{
							"audio/*": [".mp3", ".wav", ".aac"],
							"image/*": [".png", ".jpg", ".jpeg"],
						}}
						maxSize={20 * 1024 * 1024}>
						{({ getRootProps, getInputProps }) => (
							<div
								{...getRootProps()}
								className="bg-transparent w-full h-40 mb-4 rounded-lg flex justify-center items-center border-2 border-dashed hover:border-blue-500 transition-colors cursor-pointer">
								<div className="flex flex-col items-center">
									<CirclePlus className="w-16 h-16 text-gray-400" />
									<p className="text-gray-600 mt-2">
										Drop file or click to upload
									</p>
									<p className="text-sm text-gray-400">
										(Audio: MP3, WAV, AAC up to 20MB | Image: PNG, JPG up to
										20MB)
									</p>
								</div>
								<input {...getInputProps()} />
							</div>
						)}
					</Dropzone>
				) : (
					<div className="flex flex-col items-center">
						{isProcessing && (
							<div className="fixed inset-0 flex items-center justify-center bg-black/50">
								<CircularProgress color="success" className="w-12 h-12" />
							</div>
						)}

						{outputUrl && (
							<>
								{conversionType === "audio" ? (
									<>
										<div className="max-w-xs overflow-hidden rounded-lg shadow-lg">
											<img
												src={outputUrl}
												alt="Audio visualization"
												className="w-full"
											/>
										</div>
										<a
											href={outputUrl}
											download="audio-image.png"
											className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
											<Download className="w-5 h-5" />
											Download Image
										</a>
									</>
								) : (
									<>
										<audio controls className="w-full mt-4">
											<source src={outputUrl} type="audio/wav" />
											Your browser does not support audio playback
										</audio>
										<a
											href={outputUrl}
											download="restored-audio.wav"
											className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
											<Download className="w-5 h-5" />
											Download Audio
										</a>
									</>
								)}

								<button
									onClick={resetState}
									className="mt-4 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
									Convert Another File
								</button>
							</>
						)}
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

				<canvas ref={canvasRef} className="hidden" />
			</Container>
		</div>
	);
};

export default FileConverter;
