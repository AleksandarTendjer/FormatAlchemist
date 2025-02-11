export const maxDuration = 10;
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongoConnection";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = (await params).id;
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	const item = await db.collection("items").findOne({ _id: new ObjectId(id) });

	return NextResponse.json(item);
}
