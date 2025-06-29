import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Fragment, useState } from "react";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import {
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { CirclePlus, Download } from "lucide-react";
import Container from "./Container";

const steps = ["Upload item", "Choose conversion format", "Convert the item"];

const FileConverter: React.FC = (
	supportedConversions: Record<string, string[]>
) => {
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const [possibleConversions, setPossibleConversions] = useState<
		string[] | null
	>();
	const [selectedConversion, setSelectedConversion] = useState<string>("");
	const [activeStep, setActiveStep] = useState<number>(0);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [downloadFile, setDownloadFile] = useState<Blob | null>(null);

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			router.push("/converters");
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleConvertFile = async () => {
		const formData = new FormData();
		if (file) {
			formData.append("file", file);
			formData.append("targetType", selectedConversion);
			try {
				const res = await fetch(`/api/convertFile`, {
					method: "POST",
					body: formData,
				});
				if (res.ok) {
					const blob = await res.blob();
					setDownloadFile(blob);
				} else {
					console.error("Conversion failed", await res.json());
				}
			} catch {
				throw new Error("Failed to convert file");
			}
		}
	};

	const handleFileUpload = (acceptedFiles: File[]) => {
		if (
			acceptedFiles &&
			acceptedFiles[0] &&
			acceptedFiles[0]?.size > 20971520
		) {
			setAlertMessage(
				"File size exceeds the 20 MB limit. Please upload a smaller file."
			);

			setTimeout(() => {
				setAlertMessage(null);
			}, 5000);
			return;
		}

		const extension = acceptedFiles[0].name
			.slice(acceptedFiles[0].name.lastIndexOf(".") + 1)
			.toLowerCase();

		if (!supportedConversions[extension]) {
			setAlertMessage("Unsopported file type!");
			setTimeout(() => setAlertMessage(null), 3000);
			return;
		}
		setPossibleConversions(supportedConversions[extension]);
		setFile(acceptedFiles[0]);
		handleNext();
	};

	const handleSelectedConversionChange = (event: SelectChangeEvent) => {
		if (event.target.value) setSelectedConversion(event.target.value);
	};

	const handleBack = () => {
		if (activeStep === 2) setDownloadFile(null);
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
	return (
		<div className="flex items-center justify-center w-full h-full overflow-y-auto">
			<Container className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-full">
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => {
						const stepProps: { completed?: boolean } = {};
						const labelProps: {
							optional?: React.ReactNode;
						} = {};
						return (
							<Step key={index} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<div className="w-full h-full ">
					{activeStep === 0 && (
						<Fragment>
							<Dropzone
								onDrop={(acceptedFiles) => {
									handleFileUpload(acceptedFiles);
								}}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="bg-transparent w-full hover:cursor-pointer  h-2/3  sm:m-10 my-4 rounded-lg flex justify-center items-center">
										<div className=" w-1/2 h-1/2 flex flex-col items-center justify-center">
											<CirclePlus
												className="w-full h-full sm:max-h-64 sm:max-w-64"
												color="#BADEFF"
											/>
											<p>Add your files here</p>
										</div>
										<input type="file" hidden {...getInputProps()} />
									</div>
								)}
							</Dropzone>
						</Fragment>
					)}
					{activeStep == 1 && file && (
						<Fragment>
							<div className="items-center justify-center h-full w-full flex flex-col">
								<FormControl className="w-1/2 p-5 sm:m-10">
									<InputLabel id="convert-label">Target type</InputLabel>
									<Select
										className="w-full "
										label="Convert type"
										value={selectedConversion}
										onChange={handleSelectedConversionChange}>
										{possibleConversions &&
											possibleConversions.map((conversion) => (
												<MenuItem key={conversion} value={conversion}>
													{conversion.toUpperCase()}
												</MenuItem>
											))}
									</Select>
								</FormControl>
							</div>
						</Fragment>
					)}
					{activeStep === steps.length - 1 && (
						<Fragment>
							<div className="items-center justify-center h-full w-full flex flex-col">
								{!downloadFile && (
									<div className="w-1/2 h-1/4 flex flex-col rounded-lg  items-center justify-center p-10">
										<CircularProgress color="success" className="w-12 h-12" />
									</div>
								)}
								{downloadFile && (
									<div className="w-1/2 h-1/4 flex flex-col rounded-lg border-2  items-center justify-center">
										<p>
											{file?.name
												? `${file.name.substring(0, file.name.lastIndexOf("."))}.${selectedConversion}`
												: ""}
										</p>

										<a
											href={URL.createObjectURL(downloadFile)}
											download={`${file?.name.substring(0, file?.name.lastIndexOf("."))}.${selectedConversion}`}
											className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 items-center justify-center flex">
											Download
											<Download className="pl-2 w-1/2" />
										</a>
									</div>
								)}
							</div>
						</Fragment>
					)}
					{activeStep !== 0 && (
						<div className="flex flex-row justify-evenly mt-10 w-full">
							<button
								onClick={handleBack}
								className="bg-[length:200%_100%] 
             animate-gradient-flow bg-gradient-to-br from-slate-200 via-slate-500 to-slate-200 text-slate-100 hover:via-blue-500 p-4 rounded-lg">
								Back
							</button>
							<button
								onClick={() => {
									handleNext();
									handleConvertFile();
								}}
								className="relative inline-flex items-center bg-[length:200%_100%] 
             animate-gradient-flow  bg-gradient-to-br from-slate-200 via-blue-400 to-slate-200 text-slate-100 hover:bg-blue-700 p-4 rounded-lg">
								{activeStep === steps.length - 1 ? "Finish" : "Next"}
							</button>
						</div>
					)}
					{alertMessage && (
						<Alert severity="error" onClose={() => setAlertMessage(null)}>
							{alertMessage}
						</Alert>
					)}
				</div>
			</Container>
		</div>
	);
};
export default FileConverter;
