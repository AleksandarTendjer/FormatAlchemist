"use client";

import Image from "next/image";

export default function Home() {
	return (
		<div className=" overflow-hidden h-screen w-screen" id="homeParentDiv">
			<Image
				src={"/assets/imgs/landingPageBackground.gif"}
				width={100}
				height={100}
				quality={100}
				alt="background image"
				className="w-full h-full"
			/>
		</div>
	);
}
