"use client";
import { LinkType } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
interface NavbarProps {
	links: LinkType[];
}
const Navbar: React.FC<NavbarProps> = ({ links }) => {
	const [activeLink, setActiveLink] = useState<string | null>(null);

	return (
		<nav className="flex w-full  min-h-20  p-2 font-Shift80Kn justify-center items-center space-x-1 sm:space-x-8  font-semibold leading-[0.8] uppercase border-opacity-40  ">
			{links.map((link) => (
				<div
					className={`relative inline-block rounded-3xl inset-0 z-10 ${activeLink === link.name ? "bg-gray-400/50" : ""}`}
					key={link.name}>
					<Link
						href={link.path}
						key={link.name}
						data-id={link.name}
						onClick={() => setActiveLink(link.name)}
						className="z-12 mx-1 relative inline-flex bg-[url(/assets/imgs/elipse.png)] py-[0.5rem] px-[0.4rem] sm:py-[0.9rem] sm:px-[2.0rem] bg-[length:130%_110%]  sm:bg-[length:120%_100%] bg-center bg-no-repeat transition-colors text-md sm:text-md text-slate-100/70 duration-200 ">
						{link.name}
					</Link>
				</div>
			))}
		</nav>
	);
};

export default Navbar;
