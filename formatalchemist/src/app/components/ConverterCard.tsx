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
}) => {
	return (
		<Link href={link}>
			<div
				className={`bg-[url('/assets/imgs/frameConverters1.png')] bg-no-repeat bg-center bg-cover cursor-pointer p-1 shadow-lg  rounded-lg h-full w-full hover:text-gray-500 text-gray-300`}>
				<div className="m-1 max-h-3/5 max-w-4/5   ">
					<div className="flex items-center justify-between">
						<div className=" text-md sm:text-xl font-bold font-RastamanOblique">
							{title}
						</div>
						{icon}
					</div>
					<div className="my-2 text-xs sm:text-md font-TypelightSans">
						{description}
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ConverterCard;
