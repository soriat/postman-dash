import { Box, TextField } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { useState } from 'react';
import { getChartTheme } from '../theme';
import Header from './Header';

const BOTTOM_AXIS_ITEMS = 5;

const calculateMovingAverage = (dataSets, period = 3) => {
  if (period <= 1) {
    return dataSets;
  }
  return dataSets.map((series) => {
    const movingAverageData = series.data.map((dataPoint, index, array) => {
      let sum = 0;
      let count = 0;
      for (let i = Math.max(index - period + 1, 0); i <= index; i++) {
        sum += array[i].y;
        count += 1;
      }
      return { ...dataPoint, y: sum / count };
    });

    return { ...series, data: movingAverageData };
  });
};

export default function TimeLineChart({ title, subtitle, data }) {
  const [value, setValue] = useState(10);

  data = calculateMovingAverage(data, value);
  const allPoints = data.flatMap((series) => series.data.map((point) => point.y));

  const minY = Math.min(...allPoints);
  const maxY = Math.max(...allPoints);
  const avgY = Math.floor(
    allPoints.reduce((acc, val) => acc + val, 0) / allPoints.length
  );

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (newValue === '' || /^[1-9]\d*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  const averagingPeriodInput = (
    <TextField
      label="Averaging Period"
      type="number"
      value={value}
      disabled={false}
      onChange={handleChange}
      inputProps={{ min: 1 }}
    />
  );
  return (
    <>
      <Box
        mt="15px"
        p="0 15px"
        display="flex "
        justifyContent="space-between"
        alignItems="center"
      >
        <Header
          title={title}
          subtitle={`Average Response Time: ${avgY}`}
          child={averagingPeriodInput}
        />
      </Box>
      <Box height="450px" m="-40px 0 0 0">
        <ResponsiveLine
          nice={true}
          theme={getChartTheme()}
          curve="cardinal"
          data={data}
          margin={{ top: 50, right: 130, bottom: 50, left: 70 }}
          xScale={{
            type: 'time',
            nice: true,
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            max: maxY,
            min: minY,
          }}
          axisLeft={{
            legend: title,
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          axisBottom={{
            tickValues: BOTTOM_AXIS_ITEMS,
            legendPosition: 'middle',
            format: (value) => value.toDateString(),
          }}
          lineWidth={3}
          enableSlices="x"
          enablePoints={false}
          colors={{ scheme: 'paired' }}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </>
  );
}
