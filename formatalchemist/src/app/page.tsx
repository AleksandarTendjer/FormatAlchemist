"use client";

import Image from "next/image";
import { TextLoop } from "../../components/motion-primitives/text-loop";

export default function Home() {
	return (
		<div className=" overflow-hidden h-screen w-screen" id="homeParentDiv">
			<Image
				src={"/assets/imgs/landingPageBackground.gif"}
				width={100}
				height={100}
				quality={100}
				alt="background image"
				className="w-full h-full z-1 absolute"
			/>
			<div className="flex flex-col justify-center items-center w-full h-full z-10 relative">
				<TextLoop className="font-Shift80Kn text-3xl text-gray-200">
					<span>Create</span>
					<span>Convert</span>
					<span>Have fun</span>
				</TextLoop>
			</div>
		</div>
	);
}
