import { InsertOneResult, ObjectId } from "mongodb";
import clientPromise from "@/lib/mongoConnection";
import { ItemData } from "@/types";

export async function getItemById(id: string): Promise<ItemData | null> {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);
	const item = await db
		.collection<ItemData>("items")
		.findOne({ _id: new ObjectId(id) });

	return item;
}

export async function insertItem(
	url: string
): Promise<InsertOneResult<ItemData>> {
	const client = await clientPromise;
	const db = client.db(process.env.MONGODB_DB);

	const result = await db.collection("items").insertOne({
		url: url,
		createdAt: new Date(),
	});

	return result;
}
