import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.module.rules.push({
			test: /@ffmpeg\/ffmpeg/,
			type: "javascript/auto", // Prevent Webpack from parsing FFmpeg's dynamic imports incorrectly
		});
		return config;
	},
};

export default nextConfig;
