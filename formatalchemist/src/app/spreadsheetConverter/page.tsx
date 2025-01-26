"use client";

import FileConverter from "../components/FileConverter";

const SpreadsheetConverter: React.FC = () => {
	const supportedConversions: Record<string, string[]> = {
		json: ["csv", "google-sheets", "xlsx"],
		csv: ["json", "google-sheets", "xlsx"],
		xlsx: ["json", "google-sheets", "csv"],
		"google-sheets": ["json", "csv", "xlsx"],
	};
	return FileConverter(supportedConversions);
};
export default SpreadsheetConverter;
