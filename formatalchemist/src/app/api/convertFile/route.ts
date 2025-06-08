import sharp from "sharp";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";

export const config = {
	api: {
		bodyParser: false,
	},
};
/*
async function handleDataConversion(
	file: File,
	sourceType: string,
	conversionType: string
): Promise<Blob> {
	let outputBlob: Blob = null;
	
		const arrayBuffer = await file.arrayBuffer();

	if (sourceType === "csv" || sourceType === "xlsx") {
		const workbook = XLSX.read(arrayBuffer, { type: "array" });
		const firstSheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[firstSheetName];

		if (conversionType === "json") {
			const jsonData = XLSX.utils.sheet_to_json(worksheet);
			outputBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
				type: "application/json",
			});
		} else if (conversionType === "xlsx") {
			const newWorkbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Sheet1");

			const xlsxData = XLSX.write(newWorkbook, {
				bookType: "xlsx",
				type: "array",
			});
			outputBlob = new Blob([xlsxData], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
		} else if (conversionType === "csv") {
			const csvData = XLSX.utils.sheet_to_csv(worksheet);

			outputBlob = new Blob([csvData], { type: "text/csv" });
		} else {
			throw new Error("Unsupported conversion type for CSV/XLSX input");
		}
	} else if (sourceType === "json") {
		const jsonString = new TextDecoder().decode(arrayBuffer);
		const jsonData = JSON.parse(jsonString);

		if (conversionType === "csv") {
			const worksheet = XLSX.utils.json_to_sheet(jsonData);

			const csvData = XLSX.utils.sheet_to_csv(worksheet);

			outputBlob = new Blob([csvData], { type: "text/csv" });
		} else if (conversionType === "xlsx") {
			const worksheet = XLSX.utils.json_to_sheet(jsonData);
			const newWorkbook = XLSX.utils.book_new();

			XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Sheet1");

			const xlsxData = XLSX.write(newWorkbook, {
				bookType: "xlsx",
				type: "array",
			});
			outputBlob = new Blob([xlsxData], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
		} else {
			throw new Error("Unsupported conversion type for JSON input");
		}
	} else {
		throw new Error("Unsupported source type");
	}
	return outputBlob;
}
*/

async function handleImageConversion(
	file: File,
	conversionType: string
): Promise<Readable> {
	const supportedImageFormats = ["webp", "jpg", "png"];
	if (!supportedImageFormats.includes(conversionType)) {
		throw new Error("Unsupported image conversion type");
	}
	const webStream = file.stream();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const nodeReadable = Readable.fromWeb(webStream as any);

	// Create sharp processor with optimization options
	const sharpProcessor = sharp().on("error", (err) => {
		console.error("Sharp processing error:", err);
	});

	// Configure output format with optimization settings
	switch (conversionType) {
		case "jpeg":
		case "jpg":
			sharpProcessor.jpeg({ quality: 50, progressive: true });
			break;
		case "png":
			sharpProcessor.png({
				compressionLevel: 9,
				effort: 10,
				adaptiveFiltering: true,
				palette: true,
				quality: 80,
			});
			break;
		case "webp":
			sharpProcessor.webp({ quality: 70, alphaQuality: 90, lossless: false });
			break;
		default:
			throw new Error("Unsupported conversion type");
	}

	// Return the piped stream
	return nodeReadable.pipe(sharpProcessor);
}

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;
		const targetType = formData.get("targetType") as string;

		if (!file || !targetType) {
			return NextResponse.json(
				{ error: "Missing file or conversion type" },
				{ status: 400 }
			);
		}

		const result = await handleImageConversion(file, targetType);

		if (result instanceof Readable) {
			const webStream = Readable.toWeb(result) as ReadableStream<Uint8Array>;

			const mimeType = targetType === "jpg" ? "jpeg" : targetType;

			return new Response(webStream, {
				headers: {
					"Content-Type": `image/${mimeType}`,
					"Content-Disposition": `attachment; filename="converted-file.${targetType}"`,
				},
			});
		}
	} catch (error) {
		console.error("Conversion error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
