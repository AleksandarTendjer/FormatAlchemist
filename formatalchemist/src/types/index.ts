import { WithId } from "mongodb";

export type LinkType = {
	name: string;
	path: string;
};
export interface ItemData extends WithId<Document> {
	url: string;
}
