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
			fontFamily: {
				sofiaRegular: ["Sofia Pro Regular", "sans-serif"],
				sofiaItalic: ["Sofia Pro Italic", "sans-serif"],
				sofiaExtraLight: ["Sofia Pro ExtraLight", "sans-serif"],
				sofiaUltraLight: ["Sofia Pro UltraLight", "sans-serif"],
				sofiaExtraLightItalic: ["Sofia Pro ExtraLight Italic", "sans-serif"],
				sofiaUltraLightItalic: ["Sofia Pro UltraLight Italic", "sans-serif"],
				sofiaLight: ["Sofia Pro Light", "sans-serif"],
				sofiaLightItalic: ["Sofia Pro Light Italic", "sans-serif"],
				sofiaMedium: ["Sofia Pro Medium", "sans-serif"],
				sofiaMediumItalic: ["Sofia Pro Medium Italic", "sans-serif"],
				sofiaSemiBold: ["Sofia Pro SemiBold", "sans-serif"],
				sofiaSemiBoldItalic: ["Sofia Pro SemiBold Italic", "sans-serif"],
				sofiaBold: ["Sofia Pro Bold", "sans-serif"],
				sofiaBoldItalic: ["Sofia Pro Bold Italic", "sans-serif"],
				sofiaBlack: ["Sofia Pro Black", "sans-serif"],
				sofiaBlackItalic: ["Sofia Pro Black Italic", "sans-serif"],
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
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
