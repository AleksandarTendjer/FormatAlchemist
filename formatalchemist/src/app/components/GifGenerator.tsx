import React, { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";
import RangeSlider from "./RangeSlider";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Checkbox } from "@mui/material";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../../components/motion-primitives/accordion";
import { ChevronUp } from "lucide-react";

interface GifGeneratorProps {
	ffmpeg: FFmpeg | null;
	files: File[];
	isImageUpload: boolean;
	onGifCreated: (gif: Blob) => void;
	onBack: () => void;
}

const GifGenerator: React.FC<GifGeneratorProps> = ({
	ffmpeg,
	files,
	isImageUpload,
	onGifCreated,
	onBack,
}) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [from, setFrom] = useState<number>(0);
	const [to, setTo] = useState<number>(2.5);
	const [duration, setDuration] = useState<number>(0);
	const [metadataLoaded, setMetadataLoaded] = useState<boolean>(false);

	const [frameFrom, setFrameFrom] = useState<number>(1);
	const [frameTo, setFrameTo] = useState<number>(
		files.length >= 1 ? files.length : 1
	);
	const [delayTime, setDelayTime] = useState<number>(20); // in 1/100 sec
	const [gravity, setGravity] = useState<string>("top_left");
	const [useGlobalColormap, setUseGlobalColormap] = useState<boolean>(false);

	const handleSliderChange = (newFrom: number, newTo: number) => {
		setFrom(newFrom);
		setTo(newTo);
	};

	const createGif = async () => {
		const outputFileName = "output.gif";
		if (!ffmpeg) {
			return;
		}
		if (isImageUpload) {
			const fileName = files[0]?.name;
			const ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();

			for (let i = frameFrom; i <= frameTo; i++) {
				const file = files[i - 1];
				if (file) {
					await ffmpeg.writeFile(`frame_${i}.${ext}`, await fetchFile(file));
				}
			}

			const fps = (100 / delayTime).toFixed(2);
			const loopValue = "0";

			const args = [
				"-y",
				"-f",
				"image2",
				"-framerate",
				fps,
				"-start_number",
				frameFrom.toString(),
				"-i",
				`frame_%d.${ext}`,
				"-loop",
				loopValue,
				outputFileName,
			];

			if (useGlobalColormap) {
				args.splice(
					args.indexOf("-loop"),
					0,
					"-filter_complex",
					"[0:v] palettegen=stats_mode=single [p]; [0:v][p] paletteuse"
				);
			}

			await ffmpeg.exec(args);
		} else {
			const file = files[0];
			const fileExtension = file.name.split(".").pop();
			const inputFileName = `input.${fileExtension}`;
			await ffmpeg.writeFile(inputFileName, await fetchFile(file));

			const args = [
				"-i",
				inputFileName,
				"-t",
				(to - from).toString(),
				"-ss",
				from.toString(),
				"-f",
				"gif",
				outputFileName,
			];
			await ffmpeg.exec(args);
		}

		const fileData = await ffmpeg.readFile(outputFileName);
		if (!fileData) {
			throw new Error("GIF file not found.");
		}
		const gifBlob = new Blob([fileData], { type: "image/gif" });
		onGifCreated(gifBlob);
	};

	return (
		<div className="flex flex-col items-center m-5">
			{isImageUpload ? (
				<>
					<div className="grid grid-cols-4 gap-2">
						{files.map((file, i) => (
							<img
								key={i}
								src={URL.createObjectURL(file)}
								className="w-24 h-24 object-cover rounded-md"
								alt={`frame ${i + 1}`}
							/>
						))}
					</div>
					<Accordion
						className="flex w-full flex-col divide-y divide-zinc-700 "
						transition={{ duration: 0.2, ease: "easeInOut" }}>
						<AccordionItem value="getting-started" className="py-2">
							<AccordionTrigger className="w-full text-center text-zinc-950 dark:text-zinc-50">
								<div className="flex items-center justify-between text-2xl ">
									<div>Options</div>
									<ChevronUp className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="mt-4">
									<div className="flex space-x-2 justify-between">
										<label>
											From Frame:{" "}
											<input
												type="number"
												value={frameFrom}
												onChange={(e) => setFrameFrom(Number(e.target.value))}
												min={1}
												className="border rounded px-1"
											/>
										</label>
										<label>
											To Frame:{" "}
											<input
												type="number"
												value={frameTo}
												onChange={(e) => setFrameTo(Number(e.target.value))}
												min={frameFrom}
												max={files.length}
												className="border rounded px-1"
											/>
										</label>
									</div>
								</div>
								<div className="mt-4">
									<label>
										Delay time in miliseconds
										<input
											type="number"
											value={delayTime}
											onChange={(e) => setDelayTime(Number(e.target.value))}
											className="border rounded px-1"
										/>
									</label>
								</div>
								<div className="mt-4">
									<label>
										Gravity:{" "}
										<select
											value={gravity}
											onChange={(e) => setGravity(e.target.value)}
											className="border rounded px-1">
											<option value="top_left">Top Left</option>
											<option value="top_center">Top Center</option>
											<option value="top_right">Top Right</option>
											<option value="center_left">Center Left</option>
											<option value="center">Center</option>
											<option value="center_right">Center Right</option>
											<option value="bottom_left">Bottom Left</option>
											<option value="bottom_center">Bottom Center</option>
											<option value="bottom_right">Bottom Right</option>
										</select>
									</label>
								</div>
								<div className="mt-4">
									<label className="flex items-center">
										<Checkbox
											checked={useGlobalColormap}
											onChange={(e) => setUseGlobalColormap(e.target.checked)}
											className="mr-2"
										/>
										Use global colormap
									</label>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</>
			) : (
				<>
					<video
						ref={videoRef}
						className="w-full max-w-lg"
						src={URL.createObjectURL(files[0])}
						onLoadedMetadata={() => {
							if (!metadataLoaded && videoRef.current) {
								setDuration(videoRef.current.duration);
								setTo(Math.min(2.5, videoRef.current.duration));
								setMetadataLoaded(true);
							}
						}}
						controls
					/>
					<RangeSlider
						duration={duration}
						from={from}
						to={to}
						onSliderChange={handleSliderChange}
						key="video-slider"
					/>
				</>
			)}
			<div className="mt-6 flex space-x-4 sm:w-full sm:justify-evenly">
				<button
					onClick={onBack}
					className="bg-[length:200%_100%] 
             animate-gradient-flow bg-gradient-to-br from-slate-200 via-slate-500 to-slate-200 text-slate-100 hover:via-blue-500 p-4 rounded-lg">
					Back
				</button>
				<button
					onClick={createGif}
					className="bg-[length:200%_100%] 
             animate-gradient-flow bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500 p-4 rounded-lg">
					Create GIF
				</button>
			</div>
		</div>
	);
};

export default GifGenerator;
