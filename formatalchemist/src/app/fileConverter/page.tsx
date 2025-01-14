"use client";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dropzone from "react-dropzone";

const steps = ["Upload item", "Choose convert format", "Convert the item"];

const FileConverter: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	//const [conversionType, setConversionType] = useState<string>("");
	//const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
	const [activeStep, setActiveStep] = useState(0);
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
			handleNext();
		}
	};
	console.log(activeStep);
	return (
		<div className="flex items-center justify-center">
			<div className="flex flex-col py-10 w-full md:w-2/3 mx-2 h-screen">
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
							<Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="bg-slate-300 w-full h-2/3 shadow-xl sm:m-10 my-4 rounded-lg flex justify-center items-center">
										<p>
											Drag and drop <br />
											or
											<br /> Click to select from your device device
										</p>
										<input
											type="file"
											hidden
											onChange={handleFileUpload}
											{...getInputProps()}
										/>
									</div>
								)}
							</Dropzone>
						</Fragment>
					)}
					{activeStep == 1 && file && <Fragment></Fragment>}
					{activeStep === steps.length && (
						<Fragment>
							<Typography sx={{ mt: 2, mb: 1 }}>
								All steps completed - you&apos;re finished
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
								<Box sx={{ flex: "1 1 auto" }} />
								<button onClick={handleReset}>Reset</button>
							</Box>
						</Fragment>
					)}
				</div>
			</div>
		</div>
	);
};
export default FileConverter;
