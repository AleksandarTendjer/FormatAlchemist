import React from "react";
import ConverterCard from "../components/ConverterCard";
import {
	ImageIcon,
	QrCodeIcon,
	FileImageIcon as FileGifIcon,
	Type,
	FileQuestion,
} from "lucide-react";

const Converters: React.FC = () => {
	const descriptionPhotoConverter = (
		<p className="list-disc pl-3">Png to JPEG, JPEG to WebP and back </p>
	);

	const descriptionGifgenerator = (
		<p className="list-disc pl-3">
			Create Gifs from video and image files, such as MP4 and AVI video formats
			and JPG, PNG, JPEG, and HEIC.
		</p>
	);
	const descriptionImage2Soundgenerator = (
		<p className="list-disc pl-3">
			Generate audio from image types like gif,jpg,png and back.
		</p>
	);
	const descriptionQrGenerator = (
		<p className="list-disc pl-3">Post files and create QR codes for them.</p>
	);
	const descriptionJPEGCorruptor = (
		<p className="list-disc pl-3">Post jpeg images and corrupt them.</p>
	);
	return (
		<div className="max-w-7xl mx-auto  min-h-full py-6 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
			<h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-300 dark:text-gray-100 mb-6 sm:mb-12  font-Shift80Kn">
				Conversion Tools
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8  p-4">
				<ConverterCard
					icon={<ImageIcon className="w-10 h-10" />}
					title="Photo Converter"
					description={descriptionPhotoConverter}
					link="/photoConverter"
					color="bg-blue-100 hover:bg-blue-200"
				/>
				<ConverterCard
					icon={<FileGifIcon className="w-10 h-10" />}
					title="Gif Generator"
					description={descriptionGifgenerator}
					link="/gifGenerator"
					color="bg-green-100 hover:bg-green-200"
				/>
				<ConverterCard
					icon={<QrCodeIcon className="w-10 h-10" />}
					title="QR Code Generator"
					description={descriptionQrGenerator}
					link="/qrGenerator"
					color="bg-purple-100 hover:bg-purple-200"
				/>
				<ConverterCard
					icon={<FileQuestion className="w-10 h-10" />}
					title="JPEG Corruptor"
					description={descriptionJPEGCorruptor}
					link="/jpegCorruptor"
					color="bg-purple-100 hover:bg-purple-200"
				/>
				<ConverterCard
					icon={<Type className="w-10 h-10" />}
					title="Image-sound converter"
					description={descriptionImage2Soundgenerator}
					link="/audioImageConverter"
					color="bg-yellow-100 hover:bg-yellow-200"
				/>
			</div>
		</div>
	);
};
export default Converters;
