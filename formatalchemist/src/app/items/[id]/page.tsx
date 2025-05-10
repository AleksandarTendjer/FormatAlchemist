import QrCodePopup from "@/app/components/QrCodePopup";
import { getItemById } from "@/lib/items";
import { ItemData } from "@/types";
import { Alert } from "@mui/material";
import Image from "next/image";

type ItemPageProps = {
	params: Promise<{ id: string }>;
};

async function ItemPage({ params }: ItemPageProps) {
	const { id } = await params;
	console.log("id on page", id);

	const item: ItemData | null = await getItemById(id);
	console.log("item on page", item);
	if (!item) {
		return <Alert severity="error">Item not found!</Alert>;
	}

	return (
		<div className="justify-center h-full w-screen items-center flex flex-col">
			<Image
				src={item.url || "/assets/imgs/notFound.png"}
				quality={100}
				width={100}
				height={100}
				alt="item image"
				style={{ maxWidth: "100%", height: "auto" }}
				className="w-2/3 h-2/3 sm:w-1/2 sm:h-1/2 object-cover p-2 hover:cursor-grab border-4 border-x-frutigerLightGreen border-y-frutigerLightBlue"
			/>
			<QrCodePopup />
		</div>
	);
}
export default ItemPage;
