"use client";
import { LinkType } from "@/types";
import Link from "next/link";
import React from "react";
interface NavbarProps {
	links: LinkType[];
}
const Navbar: React.FC<NavbarProps> = ({ links }) => {
	return (
		<div className="w-full bg-gradient-to-br from-slate-200 via-blue-300 to-slate-200 p-2">
			<nav className="flex justify-center items-center space-x-8 py-4  font-semibold leading-[0.8] uppercase border-opacity-40 border-white ">
				{links.map((link) => (
					<Link href={link.path} key={link.name}>
						{link.name}
					</Link>
				))}
			</nav>
		</div>
	);
};

export default Navbar;
