import { Box } from '@mui/material';
import BarChart from '../../components/BarChart';
import PieChart from '../../components/PieChart';
import Table from '../../components/Table';
import TimeLineChart from '../../components/TimeLineChart';
import {
  getBarChartData,
  getBarChartDataByDay,
  getLineChartData,
  getPieChartData,
  getPieChartDataForErrors,
} from '../../data/mock_data_query';
import { useGlobalState } from '../global/GlobalStateProvider';

const Dashboard = () => {
  const { filteredData } = useGlobalState();

  return (
    <Box m="-50px 20px 0 0">
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box gridColumn="span 6" gridRow="span 3" backgroundColor="background.secondary">
          <TimeLineChart
            title="Response Time"
            subtitle="Over Time"
            data={getLineChartData(filteredData)}
          />
        </Box>
        <Box gridColumn="span 6" gridRow="span 3" backgroundColor="background.secondary">
          <BarChart
            title="Status Codes"
            subtitle="Distributed By Hour"
            xAxis="hour"
            data={getBarChartData(filteredData)}
          />
        </Box>
        <Box gridColumn="span 3" gridRow="span 3" backgroundColor="background.secondary">
          <PieChart
            title="Status Codes"
            subtitle="Pie"
            data={getPieChartData(filteredData)}
          />
        </Box>
        <Box gridColumn="span 3" gridRow="span 3" backgroundColor="background.secondary">
          <PieChart
            title="Errors"
            subtitle="Pie"
            data={getPieChartDataForErrors(filteredData)}
          />
        </Box>
        <Box gridColumn="span 6" gridRow="span 3" backgroundColor="background.secondary">
          <BarChart
            title="Status Codes"
            subtitle="Distributed By Day"
            xAxis="timestamp"
            data={getBarChartDataByDay(filteredData)}
          />
        </Box>
        <Box gridColumn="span 12" gridRow="span 6" backgroundColor="background.secondary">
          <Table title="Response Time" subtitle="Over Time" data={filteredData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
