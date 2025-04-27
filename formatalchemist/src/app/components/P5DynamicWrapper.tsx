"use client";

import dynamic from "next/dynamic";

const ReactP5Wrapper = dynamic(
	() => import("@p5-wrapper/react").then((mod) => mod.ReactP5Wrapper),
	{
		ssr: false,
		loading: () => <p>Loading sketch...</p>,
	}
);

export default ReactP5Wrapper;
