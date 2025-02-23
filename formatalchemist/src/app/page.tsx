"use client";

import Link from "next/link";

export default function Home() {
	return (
		<div className="relative">
			<div className="absolute inset-0 z-0 pointer-events-none"></div>
			<div
				className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
				aria-hidden="true">
				<div
					className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}></div>
			</div>
			<div className="relative z-10 mx-auto max-w-2xl py-10 sm:py-48 lg:py-56">
				<div className="text-center ">
					<h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
						Convert & Create with Ease
					</h1>
					<p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl/8">
						Unlock the power of seamless conversions. Whether you need a snappy
						QR code for your business, a quick image conversion for your
						creative projects, or a fun GIF generator to spice up your social
						media, our intuitive tools have you covered.
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Link href="/converters">
							<div className="rounded-md bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:via-blue-500  p-2  px-3.5 py-2.5 text-sm font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
								Start Creating Now
							</div>
						</Link>
					</div>
				</div>
			</div>
			<div
				className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
				aria-hidden="true">
				<div
					className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}></div>
			</div>
		</div>
	);
}
