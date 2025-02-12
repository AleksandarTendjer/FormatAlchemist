"use client";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ItemPageProps {
	params: { id: string };
}
interface ItemData {
	fileName: string;
	fileType: string; // e.g., "png" or "jpeg"
	fileData: string; // base64-encoded file data
}

const ItemPage: React.FC<ItemPageProps> = () => {
	const params = useParams();
	const id = params.id as string;
	const [item, setItem] = useState<ItemData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch the item from the API
		const fetchItem = async () => {
			try {
				const res = await fetch(`/api/items/${id}`);

				if (res.ok) {
					const data = await res.json();

					setItem(data);
				} else {
					console.error("Failed to fetch item, status", res.status);
				}
			} catch (error) {
				console.error("Error fetching item:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchItem();
	}, [id]);

	return (
		<div>
			<div className="justify-center h-screen w-screen items-center flex">
				{loading ? (
					<CircularProgress color="success" className="w-full h-full" />
				) : (
					<img
						src={`data:image/${item?.fileType};base64,${item?.fileData}`}
						alt={item?.fileName}
						style={{ maxWidth: "100%", height: "auto" }}
						className="w-2/3 h-2/3 sm:w-1/2 sm:h-1/2 object-cover p-2 hover:cursor-grab border-4 border-x-frutigerLightGreen border-y-frutigerLightBlue"
					/>
				)}
			</div>
		</div>
	);
};
export default ItemPage;
