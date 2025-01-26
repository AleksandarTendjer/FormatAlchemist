import { Slider } from "@mui/material";
import debounce from "just-debounce-it";

interface SliderProps {
	from: number;
	to: number;
	duration: number;
	onSliderChange: (from: number, to: number) => void;
}
const RangeSlider: React.FC<SliderProps> = ({
	duration,
	from,
	to,
	onSliderChange,
}) => {
	const debouncedSliderChange = debounce((newFrom: number, newTo: number) => {
		onSliderChange(newFrom, newTo);
	}, 300);

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			debouncedSliderChange(newValue[0], newValue[1]);
		}
	};
	return (
		<Slider
			onChange={(event, value) => {
				event.preventDefault();
				handleSliderChange(event, value);
			}}
			min={0}
			value={[from, to]}
			max={duration}
			step={0.1}
			valueLabelDisplay="auto"
		/>
	);
};

export default RangeSlider;
