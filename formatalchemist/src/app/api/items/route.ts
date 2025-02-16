export const maxDuration = 10;
import { NextRequest, NextResponse } from "next/server";
import { insertItem } from "@/lib/items";

export async function POST(req: NextRequest) {
	if (req.method !== "POST") {
		return NextResponse.json(
			{ message: "Method not allowed" },
			{ status: 405 }
		);
	}

	const formData = await req.formData();
	const file = formData.get("file") as File;

	if (!file || !(file instanceof File)) {
		return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
	}

	try {
		const result = await insertItem(file);
		const fileId = result.insertedId;
		const origin = req.headers.get("origin") || "";
		const fileUrl = `${origin}/items/${fileId}`;

		return NextResponse.json({ url: fileUrl }, { status: 200 });
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
