"use client";

import FileConverter from "../components/FileConverter";

const PhotoConverter: React.FC = () => {
	const supportedConversions: Record<string, string[]> = {
		webp: ["jpg", "png"],
		jpg: ["webp", "png"],
		png: ["webp", "jpg"],
		jpeg: ["webp", "png"],
		heic: ["png", "webp"],
		heif: ["png", "webp"],
	};
	return FileConverter(supportedConversions);
};
export default PhotoConverter;
