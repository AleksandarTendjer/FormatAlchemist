import { WithId } from "mongodb";

export type LinkType = {
	name: string;
	path: string;
};
export interface ItemData extends WithId<Document> {
	fileName: string;
	fileType: string; // e.g., "png" or "jpeg"
	fileData: string; // base64-encoded file data
}
