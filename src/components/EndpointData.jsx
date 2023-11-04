import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { List, ListItem, Typography } from '@mui/material';
import { useGlobalState } from 'scenes/global/GlobalStateProvider';

export default function EndpointData({ data }) {
  const { statusCodeType } = useGlobalState();
  const shouldShowHealth =
    statusCodeType !== 'Successes' && statusCodeType !== 'Failures';
  if (!data) {
    return;
  }

  const { successRate, fastResponseRate, statusCodeTrend, responseTimeTrend } =
    data ?? [];

  const rate = (val) => {
    let color;
    if (val >= 90) {
      color = 'green';
    } else if (val > 80) {
      color = 'black';
    } else {
      color = 'red';
    }

    return <b style={{ color: color }}>{val?.toFixed(1)}%</b>;
  };

  const trend = (val) => {
    if (isNaN(val)) {
      return <></>;
    }
    const icon =
      val > 0 ? (
        <ArrowDropUpIcon
          style={{ verticalAlign: 'bottom', fontSize: '24px', color: 'green' }}
        />
      ) : (
        <ArrowDropDownIcon
          style={{ verticalAlign: 'bottom', fontSize: '24px', color: 'red' }}
        />
      );
    return (
      <>
        {' '}
        | <b style={{ color: 'black' }}>{val}</b>
        {icon}
      </>
    );
  };

  return (
    <List sx={{ ml: '-15px' }}>
      {shouldShowHealth && (
        <ListItem>
          <Typography variant="body1">
            Health: {rate(successRate)}
            {trend(statusCodeTrend)}
          </Typography>
        </ListItem>
      )}
      <ListItem>
        <Typography variant="body1">
          Speed: {rate(fastResponseRate)}
          {trend(responseTimeTrend)}
        </Typography>
      </ListItem>
    </List>
  );
}
