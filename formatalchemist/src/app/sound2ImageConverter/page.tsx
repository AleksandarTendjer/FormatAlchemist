"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { CirclePlus, Download } from "lucide-react";
import Container from "../components/Container";

const steps = ["Upload Audio", "Download Image"];

const Audio2ImageConverter: React.FC = () => {
	const [activeStep, setActiveStep] = useState<number>(0);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [isProcessing, setIsProcessing] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleFileUpload = (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 0) return;
		const audio = acceptedFiles[0];
		if (!audio.type.startsWith("audio/")) {
			setAlertMessage("Please upload an audio file");
			return;
		}
		setAlertMessage(null);
		setActiveStep(1);
		processAudioToImage(audio);
	};

	const processAudioToImage = async (audio: File) => {
		setIsProcessing(true);
		try {
			const arrayBuffer = await audio.arrayBuffer();
			const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
			if (!AudioCtxClass) throw new Error("Web Audio API not supported");
			const audioCtx = new AudioCtxClass();
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
				imgData.data[i * 4 + 0] = gray;
				imgData.data[i * 4 + 1] = gray;
				imgData.data[i * 4 + 2] = gray;
				imgData.data[i * 4 + 3] = 255;
			}
			ctx.putImageData(imgData, 0, 0);
			const url = canvas.toDataURL("image/png");
			setImageUrl(url);
			setActiveStep(2);
		} catch (err) {
			console.error(err);
			setAlertMessage("Image generation failed");
			setActiveStep(0);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleBack = () => {
		if (activeStep === 1) setImageUrl("");
		setActiveStep((prev) => prev - 1);
		setAlertMessage(null);
	};

	return (
		<div className="flex items-center justify-center w-full h-full overflow-y-auto py-5">
			<Container className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-full">
				<Stepper activeStep={activeStep} className="mb-6">
					{steps.map((label, idx) => (
						<Step key={idx}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{activeStep === 0 && (
					<Dropzone
						onDrop={handleFileUpload}
						accept={{ "audio/*": [] }}
						maxSize={20 * 1024 * 1024}>
						{({ getRootProps, getInputProps }) => (
							<div
								{...getRootProps()}
								className="bg-transparent w-full h-40 mb-4 rounded-lg flex justify-center items-center border-2 border-dashed hover:border-blue-500 transition-colors cursor-pointer">
								<div className="flex flex-col items-center">
									<CirclePlus className="w-16 h-16 text-gray-400" />
									<p className="text-gray-600 mt-2">
										Drop audio or click to upload
									</p>
									<p className="text-sm text-gray-400">(MP3, WAV up to 20MB)</p>
								</div>
								<input {...getInputProps()} />
							</div>
						)}
					</Dropzone>
				)}

				{activeStep === 1 && (
					<div className="flex flex-col items-center">
						{isProcessing && (
							<div className="fixed inset-0 flex items-center justify-center">
								<CircularProgress color="success" className="w-12 h-12" />
							</div>
						)}

						{imageUrl && !isProcessing && (
							<>
								<div className="max-w-xs overflow-hidden rounded-lg shadow-lg">
									<img
										src={imageUrl}
										alt="Audio as grayscale"
										className="w-full"
									/>
								</div>
								<a
									href={imageUrl}
									download="audio-image.png"
									className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
									<Download className="w-5 h-5" />
									Download Image
								</a>
								<button
									onClick={handleBack}
									className="mt-4 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
									Back
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

export default Audio2ImageConverter;
