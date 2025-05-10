"use client";

import FileConverter from "../components/FileConverter";

const PhotoConverter: React.FC = () => {
	const supportedConversions: Record<string, string[]> = {
		ttf: ["woff2"],
		svg: ["ttf"],
	};
	return FileConverter(supportedConversions);
};
export default PhotoConverter;
