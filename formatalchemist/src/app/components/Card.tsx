import React from "react";

interface CardProps {
	image: React.ReactNode;
	title: string;
	description: React.ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = ({
	image,
	title,
	description,
	className,
}) => {
	return (
		<div
			className={`${
				className
					? className
					: "flex h-full items-start p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
			}`}>
			<div className="w-full">
				<div className="flex items-center space-x-4">
					<div className="w-12 h-12 flex-shrink-0 text-gray-400">{image}</div>
					<h3 className="text-lg font-bold text-gray-400">{title}</h3>
				</div>
				<hr className="border-t border-gray-300 my-2" />
				<div className="text-sm text-gray-600 mt-3">{description}</div>
			</div>
		</div>
	);
};

export default Card;
