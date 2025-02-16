export const maxDuration = 10;
import { getItemById } from "@/lib/items";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const id = url.pathname.split("/").pop();

	if (!id) {
		return NextResponse.json({ message: "ID not provided" }, { status: 400 });
	}

	const item = await getItemById(id);

	return NextResponse.json(item);
}
