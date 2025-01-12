import React from "react";

interface StatusBarProps {
	steps: { label: string; status: "pending" | "in-progress" | "completed" }[];
}

const StatusBar: React.FC<StatusBarProps> = ({ steps }) => {
	return (
		<div className="flex items-center w-full">
			{steps.map((step, index) => (
				<div
					key={index}
					className={`flex items-center w-full ${
						index !== steps.length - 1 ? "mr-4" : ""
					}`}>
					<div
						className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
							step.status === "completed"
								? "bg-green-500"
								: step.status === "in-progress"
									? "bg-blue-500 animate-pulse"
									: "bg-gray-300"
						}`}>
						{index + 1}
					</div>

					<div className="ml-2">
						<span
							className={`text-sm font-semibold ${
								step.status === "completed"
									? "text-green-600"
									: step.status === "in-progress"
										? "text-blue-600"
										: "text-gray-500"
							}`}>
							{step.label}
						</span>
					</div>

					{index !== steps.length - 1 && (
						<div
							className={`flex-grow h-1 ${
								steps[index + 1].status === "completed"
									? "bg-green-500"
									: "bg-gray-300"
							}`}></div>
					)}
				</div>
			))}
		</div>
	);
};

export default StatusBar;
