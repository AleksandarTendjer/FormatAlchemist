"use client";
import { LinkType } from "@/types";
import Link from "next/link";
import React from "react";
import { AnimatedBackground } from "../../../components/motion-primitives/animated-background";
interface NavbarProps {
	links: LinkType[];
}
const Navbar: React.FC<NavbarProps> = ({ links }) => {
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
							className="px-4 py-2 mx-2 relative inline-flex transition-colors duration-200">
							{link.name}
						</Link>
					))}
				</AnimatedBackground>
			</nav>
		</div>
	);
};

export default Navbar;
