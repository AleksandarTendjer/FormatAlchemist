"use client";

import Container from "../components/Container";

export default function About() {
	return (
		<div className=" overflow-hidden h-screen w-screen" id="homeParentDiv">
			<div className="flex flex-col justify-center items-center w-full h-full z-20 relative bg-[url('/assets/imgs/FrameSquare.png')] h-80 w-80 bg-no-repeat bg-center bg-contain">
				<Container className="flex flex-col py-4 w-2/3 sm:w-1/3 mx-2 h-11/12 z-10 m-3">
					<div className="relative  w-full sm:w-4/5 justify-center items-center  sm:justify-center tracking-tight sm:tracking-normal font-TypelightSans sm:font-RoSpritendo tiny text-xs sm:text-sm sm:font-light self-center flex flex-col">
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line ">
							FormatAlchemist is a opensource digital lab for the curious and
							creative. It’s a space where formats transform, interwind with
							eachother and create something new. It’s weird, it’s experimental,
							and it’s totally free.
						</p>
						<br />
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line">
							The whole project and the code is available on this Github{" "}
							<a
								href="https://github.com/AleksandarTendjer/FormatAlchemist"
								className=" hover:text-gray-500 text-blue-500/60">
								repository
							</a>
							, so if you want to contribute and be part of the creative chaos,
							you’re more than welcome! This is a collaborative space — artists,
							developers and the curious are all invited.
						</p>
						<br />
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line">
							Contributors:{" "}
							<a
								href="https://alextendjer.com"
								className="hover:text-gray-500 text-blue-500/60">
								@alex
							</a>
							.
						</p>
					</div>
				</Container>
			</div>
		</div>
	);
}
