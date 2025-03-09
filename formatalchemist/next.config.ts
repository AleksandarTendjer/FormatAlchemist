import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "8mb",
		},
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /@ffmpeg\/ffmpeg/,
			type: "javascript/auto",
		});
		return config;
	},
};

export default nextConfig;
