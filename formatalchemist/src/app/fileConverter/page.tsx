"use client";

import StatusBar from "../components/StatusBar";

const FileConverter: React.FC = () => {
	return (
		<div className="flex flex-col">
			<StatusBar
				steps={[
					{ label: "Upload file", status: "pending" },
					{ label: "Set convert type", status: "in-progress" },
					{ label: "Download file", status: "completed" },
				]}
			/>
		</div>
	);
};
export default FileConverter;
