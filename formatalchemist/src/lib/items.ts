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
	file: File
): Promise<InsertOneResult<ItemData>> {
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

	return result;
}
