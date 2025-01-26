"use client";

import FileConverter from "../components/FileConverter";

const PhotoConverter: React.FC = () => {
	const supportedConversions: Record<string, string[]> = {
		webp: ["jpg", "png"],
		jpg: ["webp", "png"],
		png: ["webp", "jpg"],
	};
	return FileConverter(supportedConversions);
};
export default PhotoConverter;
