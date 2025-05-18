"use client";

import Image from "next/image";
import Container from "../components/Container";

export default function About() {
	return (
		<div className=" overflow-hidden h-screen w-screen" id="homeParentDiv">
			<div className="flex flex-col justify-center items-center w-full h-full z-10 relative">
				<Container className="flex flex-col py-10 w-4/5 md:w-2/3 mx-2 h-2/3">
					<Image
						src={"/assets/imgs/textBG.png"}
						width={100}
						height={100}
						quality={100}
						alt="background image"
						className="w-1/4 h-1/5 sm:w-1/5 sm:h-1/4  z-1  absolute top-20 left-5 sm:left-10"
					/>
					<div className="relative mx-auto w-4/5 items-center justify-center tracking-tight sm:tracking-normal font-TypelightSans sm:font-RoSpritendo tiny text-xs sm:text-base sm:font-light self-center flex flex-col">
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line ">
							FormatAlchemist is a playground for the curious and creative. It’s
							a space where formats transform, interwind with eachother and
							create something new. It’s weird, it’s experimental, and it’s
							totally free.
						</p>
						<br />
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line">
							This is not a typical conversion tool, but kind of a digital lab
							where we can explore different possibilities how data can morph.
						</p>
						<br />
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line">
							It’s made as an opensource project and the whole code is available
							on this Github{" "}
							<a
								href="https://github.com/AleksandarTendjer/FormatAlchemist"
								className=" hover:text-gray-500 text-blue-500/60">
								repository
							</a>
						</p>
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line">
							If you have an idea for a new converter, want to contribute code,
							or simply want to be part of the creative chaos, you’re more than
							welcome. This is a collaborative space — artists, developers,
							tinkerers, and the curious are all invited.
						</p>
						<br />
						<p className="text-gray-200 indent-2 text-center whitespace-pre-line">
							Created and maintained by{" "}
							<a
								href="https://alextendjer.com"
								className="hover:text-gray-500 text-blue-500/60">
								alextendjer.com
							</a>
							.
						</p>
					</div>
					<Image
						src={"/assets/imgs/textBG2.png"}
						width={100}
						height={100}
						quality={100}
						alt="background image"
						className="w-1/4 h-1/5 sm:w-1/5 sm:h-1/4 z-1 absolute bottom-20  right-10 sm:right-20"
					/>
				</Container>
			</div>
		</div>
	);
}
