import React from "react";
import { AtSignIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import Card from "../components/Card";

const Converters: React.FC = () => {
	const descriptionPhotoConverter = (
		<ul className="list-disc pl-5">
			<li>Png to JPEG, JPEG to WebP (and back 🔂)</li>
			<li>Excel to CSV, CSV to JSON (and back 🔂)</li>
			<li>MP4 to MP3 🎶 or WAV to MP3 (and vice versa)</li>
		</ul>
	);
	const descriptionSpreadsheetConverter = (
		<ul className="list-disc pl-5">
			<li>Excel to CSV, CSV to JSON (and back 🔂)</li>
		</ul>
	);
	const descriptionGifConverter = (
		<ul className="list-disc pl-5">
			<li>Create Gifs from video files</li>
		</ul>
	);
	return (
		<div className="flex-grow flex ">
			<div className="grid grid-cols-6 md:grid-cols-9 gap-1 sm:gap-4 w-full p-10 ">
				<div className=" max-h-60  col-span-3">
					<Link href="/photoConverter">
						<Card
							image={<FileIcon className="w-full h-full" />}
							title="File Converter"
							description={descriptionPhotoConverter}
						/>
					</Link>
				</div>
				<div className=" max-h-60  col-span-3">
					<Link href="/spreadsheetConverter">
						<Card
							image={<FileIcon className="w-full h-full" />}
							title="Spreadsheet Converter"
							description={descriptionSpreadsheetConverter}
						/>
					</Link>
				</div>
				<div className=" max-h-60  col-span-3">
					<Link href="/gifMaker">
						<Card
							image={<FileIcon className="w-full h-full" />}
							title="Gif maker"
							description={descriptionGifConverter}
						/>
					</Link>
				</div>
				<div className="max-h-60   md:col-start-5 col-span-3 ">
					<Link href="/fileConverter">
						<Card
							image={<AtSignIcon className="w-full h-full" />}
							title="Url Converter"
							description="Convert files"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default Converters;
