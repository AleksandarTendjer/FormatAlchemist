import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { LinkType } from "@/types";
import type { Viewport } from "next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Format alchemist",
	description:
		"Online file converter & creator: Generate QR codes, convert images (JPG/PNG/HEIC), create GIFs from videos. Fast, secure, and free web-based tools.",
	icons: {
		icon: "/assets/imgs/home.png",
	},
};
const links: LinkType[] = [
	{ name: "Home", path: "/" },
	{ name: "Converters", path: "/converters" },
	{ name: "About", path: "/about" },
];
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<div className="min-h-[100dvh]  flex flex-col bg-[url(/assets/imgs/layoutBackground.gif)]  font-RoSpritendo  ">
					<Navbar links={links} />
					<main
						className="flex-1 relative overflow-y-auto max-w-[100vw] overflow-x-clip"
						id="mainContent">
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
