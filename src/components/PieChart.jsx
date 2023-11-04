import { Box } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import Header from './Header';

export default function MyPieChart({ title, subtitle, data }) {
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
      <Box height="450px" m="0">
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'paired' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
      </Box>
    </>
  );
}
