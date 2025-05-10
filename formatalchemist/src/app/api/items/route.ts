export const maxDuration = 10;
import { NextRequest, NextResponse } from "next/server";
import { insertItem } from "@/lib/items";
import { put } from "@vercel/blob";

const allowedFileTypes = [
	"image/gif",

	"image/png",

	"image/jpeg",

	"image/webp",

	"video/mp4",

	"video/webm",

	"video/ogg",
];
export async function POST(req: NextRequest) {
	console.log("here");
	if (req.method !== "POST") {
		return NextResponse.json(
			{ message: "Method not allowed" },
			{ status: 405 }
		);
	}

	const formData = await req.formData();
	const file = formData.get("file");
	if (!file || !(file instanceof File)) {
		return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
	}
	console.log(file.type);
	if (!allowedFileTypes.includes(file.type)) {
		return NextResponse.json(
			{ error: "Only GIF,Video or Image formats are allowed" },
			{ status: 400 }
		);
	}

	try {
		const { url } = await put(file.name, file, {
			access: "public",
			addRandomSuffix: true,
		});

		const result = await insertItem(url);

		return NextResponse.json({ url: result.insertedId }, { status: 200 });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				error: "Error uploading file to database.",
			},
			{ status: 500 }
		);
	}
}
