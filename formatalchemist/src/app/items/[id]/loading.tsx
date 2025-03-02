import { CircularProgress } from "@mui/material";

const loader = () => {
	return (
		<div className="justify-center h-full w-screen items-center flex">
			<CircularProgress color="success" className="w-full h-full" />
		</div>
	);
};
export default loader;
