"use client";
import { LinkType } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import { AnimatedBackground } from "../../../components/motion-primitives/animated-background";
interface NavbarProps {
	links: LinkType[];
}
const Navbar: React.FC<NavbarProps> = ({ links }) => {
	const [activeLink, setActiveLink] = useState<string | null>(null);

	return (
		<div className="w-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-200 p-2 font-Shift80Kn">
			<nav className="flex justify-center items-center space-x-1 sm:space-x-8 h-full  font-semibold leading-[0.8] uppercase border-opacity-40 border-white  ">
				<AnimatedBackground
					enableHover
					className="bg-white/50 rounded-lg "
					transition={{ duration: 0.2, type: "tween" }}>
					{links.map((link) => (
						<Link
							href={link.path}
							key={link.name}
							data-id={link.name}
							onClick={() => setActiveLink(link.name)}
							className="sm:px-4  mx-1 sm:mx-2 relative inline-flex transition-colors text-md sm:text-xl text-slate-100/70 duration-200">
							{activeLink === link.name && (
								<img
									src="/assets/imgs/coolOrb.png"
									alt="Active indicator"
									className="hidden sm:visible absolute -left-4 -top-2 w-10 h-10 transition-transform duration-300"
								/>
							)}
							{link.name}
						</Link>
					))}
				</AnimatedBackground>
			</nav>
		</div>
	);
};

export default Navbar;
