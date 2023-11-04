import { Box, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { format } from 'date-fns';
import { getTimestamps } from '../../data/mock_data_query';
import { useGlobalState } from './GlobalStateProvider';

export default function TimestampRangeSlider() {
  const timestamps = getTimestamps();
  const unixTimestamps = timestamps.map((t) => new Date(t).getTime());
  const { sliderRange, setSliderRange } = useGlobalState();

  const handleChange = (event, newValue) => {
    setSliderRange(newValue);
  };

  const formatTimestamp = (unix) => format(new Date(unix), 'MMM dd, p');
  const formatRange = (range) =>
    `${formatTimestamp(range[0])} - ${formatTimestamp(range[1])}`;

  return (
    <Box
      gridColumn="span 8"
      bgcolor="background.paper"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={5}
      width="100%"
    >
      <Typography id="range-slider">Time Range</Typography>
      <Slider
        min={unixTimestamps[0]}
        max={unixTimestamps[unixTimestamps.length - 1]}
        value={sliderRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={formatTimestamp}
        getAriaLabel={() => 'Time range'}
        getAriaValueText={formatTimestamp}
      />
      <Typography variant="body1" component="div" sx={{ textAlign: 'center' }}>
        Selected Range: <b>{formatRange(sliderRange)}</b>
      </Typography>
    </Box>
  );
}
