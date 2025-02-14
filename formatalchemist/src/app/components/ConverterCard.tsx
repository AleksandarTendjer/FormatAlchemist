import Link from "next/link";
import React from "react";
interface CardProps {
	icon: React.ReactNode;
	title: string;
	description: React.ReactNode;
	link: string;
	color?: string;
}

const ConverterCard: React.FC<CardProps> = ({
	icon,
	title,
	description,
	link,
	color,
}) => {
	return (
		<Link href={link}>
			<div
				className={`${color} cursor-pointer p-1 shadow-lg border-2 rounded-lg`}>
				<div className="mt-2 text-gray-700 dark:text-gray-300 mx-2">
					<div className="flex items-center justify-between">
						<div className="text-2xl font-bold">{title}</div>
						{icon}
					</div>
					<div className="my-2">{description}</div>
				</div>
			</div>
		</Link>
	);
};

export default ConverterCard;
