import { Box } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { getChartTheme } from '../theme';
import Header from './Header';

export default function BarChart({ title, subtitle, data, xAxis }) {
  const uniqueStatusKeys = data.reduce((keys, entry) => {
    Object.keys(entry).forEach((key) => {
      if (
        (!isNaN(key) || key === 'success' || key === 'failure') &&
        !keys.includes(key)
      ) {
        keys.push(key);
      }
    });
    return keys;
  }, []);

  return (
    <>
      <Box
        mt="15px"
        p="0 15px"
        display="flex "
        justifyContent="space-between"
        alignItems="center"
      >
        <Header title={title} subtitle={subtitle} />
      </Box>
      <Box height="450px" m="-40px 0 0 0">
        <ResponsiveBar
          data={data}
          keys={uniqueStatusKeys}
          theme={getChartTheme()}
          indexBy={xAxis}
          margin={{ top: 50, right: 130, bottom: 50, left: 70 }}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'paired' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          borderWidth={1}
          labelSkipWidth={12}
          labelSkipHeight={12}
          isInteractive={true}
          axisBottom={{
            tickValues: xAxis === 'hour' ? 24 : [],
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 12,
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
