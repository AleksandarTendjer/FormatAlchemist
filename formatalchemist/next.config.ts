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
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "exg5lj9z1sayfsqu.public.blob.vercel-storage.com",
			},
		],
	},
};

export default nextConfig;
