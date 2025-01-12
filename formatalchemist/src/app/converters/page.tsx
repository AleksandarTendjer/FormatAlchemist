import React from "react";
import { AtSignIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import Card from "../components/Card";

const Converters: React.FC = () => {
	const descriptionFileConverter = (
		<ul className="list-disc pl-5">
			<li>✨ Convert your files like a pro! 📄</li>
			<li>PDF to Word and vice versa 🔄</li>
			<li>Excel to CSV, CSV to JSON (and back 🔂)</li>
			<li>MP4 to MP3 🎶 or WAV to MP3 (and vice versa)</li>
			<li>Even Google Sheets to Excel! 💼</li>
		</ul>
	);
	return (
		<div className="grid grid-cols-6 md:grid-cols-9 gap-1 sm:gap-4 w-full p-10 ">
			<div className=" max-h-60  col-span-3">
				<Link href="/fileConverter">
					<Card
						image={<FileIcon className="w-full h-full" />}
						title="File Converter"
						description={descriptionFileConverter}
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
	);
};
export default Converters;
