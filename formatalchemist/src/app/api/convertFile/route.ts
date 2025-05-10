import sharp from "sharp";
import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import ttf2woff2 from "ttf2woff2";
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
): Promise<Buffer> {
	const arrayBuffer = await file.arrayBuffer();
	const inputBuffer = Buffer.from(arrayBuffer);

	const supportedImageFormats = ["webp", "jpg", "png"];
	if (!supportedImageFormats.includes(conversionType)) {
		throw new Error("Unsupported image conversion type");
	}
	const formatInfo = sharp.format[conversionType as keyof typeof sharp.format];

	const convertedBuffer = await sharp(inputBuffer)
		.toFormat(formatInfo)
		.toBuffer();

	return convertedBuffer;
}
async function handleFontFormatConversion(
	file: File,
	sourceType: string
): Promise<Buffer> {
	const arrayBuffer = await file.arrayBuffer();
	const sourceFontBuffer = Buffer.from(arrayBuffer);
	let targetBuffer: Buffer = sourceFontBuffer;

	if (sourceType != "svg") {
		targetBuffer = ttf2woff2(sourceFontBuffer);
	} else {
		/*const { url: svgUrl } = await put(file.name, file, {
			access: "public",
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});
		const svgContent = sourceFontBuffer.toString("utf-8");
		const options = {
			fontName: "ttfFont", // Required font family name
			startUnicode: 0xe000, // Starting Unicode point
			svg2ttf: {
				// TTF generation options
				ts: Math.round(Date.now() / 1000), // Timestamp
				version: "1.0", // Font version
			},
			log: false, // Disable logging if not needed
		};
		createSVG()
		const ttfBuffer = await createTTF(svgContent, options);
		await del(svgUrl);*/
	}
	return targetBuffer;
}

async function handleConversion(
	file: File,
	sourceType: string,
	targetType: string
): Promise<Blob | Buffer> {
	//const dataFormats = ["csv", "json", "google-sheets", "xlsx"];
	const imageFormats = ["webp", "jpg", "png"];
	const fontFormats = ["otf", "ttf", "woff", "woff2"];
	//const audioFormats = ["mp4", "mp3", "wav", "aac", "ogg"];

	/*if (dataFormats.includes(sourceType) && dataFormats.includes(targetType)) {
		return await handleDataConversion(file, sourceType, targetType);
	} else*/
	if (imageFormats.includes(sourceType) && imageFormats.includes(targetType)) {
		return await handleImageConversion(file, targetType);
	} else if (
		fontFormats.includes(sourceType) &&
		fontFormats.includes(targetType)
	) {
		return await handleFontFormatConversion(file, sourceType);
	} else {
		throw new Error(
			`Conversion from ${sourceType} to ${targetType} is not supported`
		);
	}
}

export async function POST(req: Request) {
	const formData = await req.formData();
	const file = formData.get("file") as File;
	const targetType = formData.get("targetType") as string;

	if (!file || !targetType) {
		return NextResponse.json(
			{ error: "Missing file or conversion type" },
			{ status: 400 }
		);
	}

	const fileName = file.name;
	const sourceType =
		fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase() || "";

	const result = await handleConversion(file, sourceType, targetType);

	const contentType =
		targetType === "json"
			? "application/json"
			: targetType === "csv"
				? "text/csv"
				: targetType === "xlsx"
					? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					: ["jpg", "jpeg", "png", "webp"].includes(targetType)
						? `image/${targetType}`
						: ["mp3", "wav", "aac", "ogg"].includes(targetType)
							? `audio/${targetType}`
							: "application/octet-stream";

	return new NextResponse(result, {
		headers: {
			"Content-Type": `image/${contentType}`,
			"Content-Disposition": `attachment; filename="converted-file.${targetType}"`,
		},
	});
}
