"use client";

import P5DynamicWrapper from "@/app/components/P5DynamicWrapper";
import { type Sketch } from "@p5-wrapper/react";
import p5Type from "p5";

const FONT_SIZE = 16;
const FONT_SIZE_BIG = 32;
const RANGE = 0x7e - 0x21;
let font: p5Type.Font;
let pg: p5Type.Graphics | null = null;
let W: number;
let H: number;
const sketch: Sketch = (p5) => {
	p5.preload = () => {
		font = p5.loadFont("/assets/fonts/RoSpritendoSemiboldBeta.otf");
	};
	p5.setup = () => {
		W = 800;
		H = 800;
		p5.createCanvas(W, H);
		pg = p5.createGraphics(W / FONT_SIZE, H / FONT_SIZE);
		p5.textFont(font);
		p5.textSize(FONT_SIZE);
	};

	p5.draw = () => {
		const currentFrame = p5.frameCount;
		const c = pg?.color(
			currentFrame % RANGE, // Hue
			RANGE,
			RANGE
		);
		p5.background("steelblue");
		p5.noSmooth();
		p5.clear();
		pg?.colorMode("hsb");
		if (c) {
			pg?.stroke(c);
			pg?.fill(c);
		}
		pg?.rect(10, 10, 10, 10);

		p5.textSize(FONT_SIZE_BIG);
		p5.fill("palegreen");
		p5.text("CONVERT", 80, 80);
		p5.textSize(FONT_SIZE);

		if (pg) {
			p5.image(pg, 0, 0, W, H);
			for (let y = 11; y < 21; y++)
				for (let x = 11; x < 21; x++) {
					pg.loadPixels();
					const pixel = pg.get(x, y);
					const brightness = p5.brightness(pixel);
					// Use brightness to determine character
					const cc = brightness == 0 ? 0 : p5.hue(pixel) + 0x21;
					const ch = String.fromCharCode(cc);
					p5.fill(255);
					p5.noStroke();
					p5.text(ch, x * FONT_SIZE, y * FONT_SIZE);
				}
		}

		p5.textSize(FONT_SIZE_BIG);
		p5.fill("palegreen");
		p5.text("CREATE", 80, 550);
		p5.textSize(FONT_SIZE);
	};
};

export default function Home() {
	return (
		<div className="relative overflow-hidden w-full h-full" id="homeParentDiv">
			<P5DynamicWrapper sketch={sketch} />;
		</div>
	);
}
