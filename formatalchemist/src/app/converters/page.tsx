import React from "react";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import Card from "../components/Card";

const Converters: React.FC = () => {
	const descriptionPhotoConverter = (
		<ul className="list-disc pl-5">
			<li>Png to JPEG, JPEG to WebP (and back 🔂)</li>
		</ul>
	);

	const descriptionGifConverter = (
		<ul className="list-disc pl-5">
			<li>Create Gifs from video and image files</li>
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
					<Link href="/gifMaker">
						<Card
							image={<FileIcon className="w-full h-full" />}
							title="Gif maker"
							description={descriptionGifConverter}
						/>
					</Link>
				</div>
				<div className=" max-h-60  col-span-3">
					<Link href="/qrGenerator">
						<Card
							image={<FileIcon className="w-full h-full" />}
							title="QR Code Generator"
							description={descriptionGifConverter}
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default Converters;
