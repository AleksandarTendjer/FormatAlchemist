import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			animation: {
				"gradient-flow": "gradient-flow 3s ease infinite",
			},
			keyframes: {
				"gradient-flow": {
					"0%": { "background-position": "100% 50%" },
					"100%": { "background-position": "0% 50%" },
				},
			},
			backgroundSize: {
				"gradient-flow": "200% 100%",
			},
			fontFamily: {
				RoSpritendo: ['"Spritendo"', "sans-serif"],
				TypelightSans: ['"TypelightSans"', "sans-serif"],
				Shift80Kn: ["Shift-80Kn", "sans-serif"],
				RastamanOblique: ["Rastamanoblique", "sans-serif"],
			},
			colors: {
				frutigerPaleBlue: "#E8F8FF",
				frutigerPaleGreen: "#F2FFF9",
				frutigerPaleOrange: "#FFF9F2",
				frutigerBlue: "#3BAFDA",
				frutigerGreen: "#91E4C1",
				frutigerOrange: "#FDB44B",
				frutigerLightBlue: "#AEE3F4",
				frutigerLightGreen: "#C9F6E0",
				frutigerLightOrange: "#FDE2C8",
				frutigerAqua: "#76D8D2",
				frutigerGoldenOrange: "#FFC27E",
			},
			backgroundImage: {
				"gradient-to-via":
					"linear-gradient(to right, var(--tw-gradient-stops))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
} satisfies Config;
