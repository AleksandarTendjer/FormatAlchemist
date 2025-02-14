import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!process.env.MONGODB_URI) {
	throw new Error("Please add your Mongo URI to .env.local");
}

const options: MongoClientOptions = {
	maxPoolSize: 10,
};
const client: MongoClient = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
