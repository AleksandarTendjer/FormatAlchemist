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
		<div className="w-full bg-gradient-to-br from-slate-200 via-blue-300 to-slate-200 p-2">
			<nav className="flex justify-center items-center space-x-8 py-4  font-semibold leading-[0.8] uppercase border-opacity-40 border-white ">
				<AnimatedBackground
					enableHover
					className="bg-white/50 rounded-lg backdrop-blur-sm"
					transition={{ duration: 0.2, type: "tween" }}>
					{links.map((link) => (
						<Link
							href={link.path}
							key={link.name}
							data-id={link.name}
							onClick={() => setActiveLink(link.name)}
							className="px-4 py-2 mx-2 relative inline-flex transition-colors duration-200">
							{activeLink === link.name && (
								<img
									src="/assets/imgs/coolOrb.png"
									alt="Active indicator"
									className="absolute -left-4 -top-1 w-10 h-10 transition-transform duration-300"
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
