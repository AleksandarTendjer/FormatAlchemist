export const maxDuration = 10;
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongoConnection";

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
		const arrayBuffer = await file.arrayBuffer();
		const fileBuffer = Buffer.from(arrayBuffer);
		const fileBase64 = fileBuffer.toString("base64");

		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DB);
		const result = await db.collection("items").insertOne({
			fileName: file.name,
			fileType: file.type,
			fileData: fileBase64,
			createdAt: new Date(),
		});

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
