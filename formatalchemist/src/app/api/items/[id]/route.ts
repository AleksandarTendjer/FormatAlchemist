export const maxDuration = 10;
import { getItemById } from "@/lib/items";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	console.log("url ", url);
	const id = url.pathname.split("/").pop();
	console.log("id ", id);

	if (!id) {
		return NextResponse.json({ message: "ID not provided" }, { status: 400 });
	}

	const item = await getItemById(id);
	console.log("item ", item);
	return NextResponse.json(item);
}
