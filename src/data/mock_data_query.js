import { timeParse } from 'd3-time-format';
import { mockApiData } from './mock_api_data';

const parseTime = timeParse('%Y-%m-%dT%H:%M:%S.%LZ');

export const getErrorCodes = (filters) => {};

export const filterData = (filters) => {
  const {
    checkedPaths,
    sliderRange,
    statusCodeType,
    selectedStatusCodes,
    setFilteredData,
    setSpecificData,
  } = filters;

  const [minTimestamp, maxTimestamp] = sliderRange;
  let data = mockApiData.filter((item) => {
    const itemTimestamp = new Date(item.timestamp).getTime();
    return (
      itemTimestamp >= minTimestamp &&
      itemTimestamp <= maxTimestamp &&
      checkedPaths.includes(item.path)
    );
  });

  let modifiedData;
  switch (statusCodeType) {
    case 'Combined':
      modifiedData = data.map((entry) => ({
        ...entry,
        status_code: entry.status_code.toString().startsWith('2') ? 'success' : 'failure',
      }));
      break;
    case 'Failures':
      modifiedData = data.filter(
        (entry) => !entry.status_code.toString().startsWith('2')
      );
      break;
    case 'Errors':
      modifiedData = data.filter(
        (entry) => !entry.status_code.toString().startsWith('2')
      );
      break;
    case 'Successes':
      modifiedData = data.filter((entry) => entry.status_code.toString().startsWith('2'));
      break;
    case 'Specific':
      setSpecificData(data);
      modifiedData = data.filter((entry) =>
        selectedStatusCodes.includes(entry.status_code)
      );
      break;
    case 'Granular':
    default:
      modifiedData = data;
      break;
  }

  setFilteredData(modifiedData);
};

export const getTimestamps = () => {
  return mockApiData.map((el) => el.timestamp);
};

export const getBarChartData = (data) => {
  const groupedData = data.reduce((acc, { timestamp, status_code }) => {
    const hour = new Date(timestamp).getUTCHours();
    if (!acc[hour]) {
      acc[hour] = {};
    }

    if (!acc[hour][`${status_code}`]) {
      acc[hour][`${status_code}`] = 0;
    }
    acc[hour][`${status_code}`] += 1;

    return acc;
  }, {});

  return Object.entries(groupedData).map(([key, value]) => ({
    hour: `${key}`,
    ...value,
  }));
};

export const getBarChartDataByDay = (data) => {
  const groupedByTimestamp = {};

  data.forEach(({ timestamp, status_code }) => {
    const dateKey = new Date(timestamp).toISOString().split('T')[0];
    if (!groupedByTimestamp[dateKey]) {
      groupedByTimestamp[dateKey] = {};
    }
    groupedByTimestamp[dateKey][status_code] =
      (groupedByTimestamp[dateKey][status_code] || 0) + 1;
  });

  return Object.keys(groupedByTimestamp).map((dateKey) => {
    return {
      timestamp: dateKey,
      ...groupedByTimestamp[dateKey],
    };
  });
};

export const getPieChartData = (data) => {
  const countByStatusCode = {};

  data.forEach((item) => {
    const { status_code } = item;
    countByStatusCode[status_code] = (countByStatusCode[status_code] || 0) + 1;
  });

  return Object.keys(countByStatusCode).map((statusCode) => ({
    id: statusCode,
    label: `Status Code ${statusCode}`,
    value: countByStatusCode[statusCode],
  }));
};

export const getPieChartDataForErrors = (data) => {
  const countByError = {};

  data.forEach((item) => {
    const { error } = item;
    if (error !== '') {
      countByError[error] = (countByError[error] || 0) + 1;
    }
  });

  return Object.keys(countByError).map((errorMsg) => ({
    id: errorMsg,
    label: `${errorMsg}`,
    value: countByError[errorMsg],
  }));
};

export const getLineChartData = (data) => {
  const xAxis = 'timestamp';
  const yAxis = 'response_time';
  let formattedData = new Map();
  data.map((el) => {
    const datum = {
      x: parseTime(el[xAxis]),
      y: el[yAxis],
    };

    formattedData.set(el.path, [...(formattedData.get(el.path) ?? []), datum]);
    return el;
  });

  let res = [];
  for (const [key, value] of formattedData) {
    res.push({
      id: key,
      data: value,
    });
  }

  return [...res].sort((a, b) => {
    return b.id.localeCompare(a.id);
  });
};

function linearRegression(data) {
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;

  data.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export function analyzeApiData(data) {
  const pathStats = {};
  const allStats = {
    totalRequests: 0,
    successfulRequests: 0,
    over800ms: 0,
    statusCodeValues: [],
    responseTimeValues: [],
    timestamps: [],
  };

  data.forEach(({ path, status_code, response_time, timestamp }) => {
    pathStats[path] = pathStats[path] || {
      totalRequests: 0,
      successfulRequests: 0,
      timeUnderThreshold: 0,
      statusCodeValues: [],
      responseTimeValues: [],
      timestamps: [],
    };

    const date = new Date(timestamp);
    const timeValue = date.getTime() / (1000 * 60 * 60);
    const isSuccessful =
      status_code.toString().startsWith('2') || status_code.toString() === 'success';

    pathStats[path].totalRequests++;
    if (isSuccessful) {
      pathStats[path].successfulRequests++;
    }
    if (response_time < 1000) {
      pathStats[path].timeUnderThreshold++;
    }
    pathStats[path].statusCodeValues.push(isSuccessful ? 1000 : 0);
    pathStats[path].responseTimeValues.push(response_time);
    pathStats[path].timestamps.push(timeValue);

    allStats.totalRequests++;
    if (isSuccessful) {
      allStats.successfulRequests++;
    }
    if (response_time < 1000) {
      allStats.timeUnderThreshold++;
    }
    allStats.statusCodeValues.push(isSuccessful ? 1000 : 0);
    allStats.responseTimeValues.push(response_time);
    allStats.timestamps.push(timeValue);
  });

  const results = {};
  Object.keys(pathStats).forEach((path) => {
    const {
      totalRequests,
      successfulRequests,
      timeUnderThreshold,
      statusCodeValues,
      responseTimeValues,
      timestamps,
    } = pathStats[path];

    results[path] = {
      successRate: (successfulRequests / totalRequests) * 100,
      fastResponseRate: (timeUnderThreshold / totalRequests) * 100,
      statusCodeTrend: `${linearRegression(
        timestamps.map((t, i) => [t, statusCodeValues[i]])
      ).slope.toFixed(2)}`,
      responseTimeTrend: `${linearRegression(
        timestamps.map((t, i) => [t, responseTimeValues[i]])
      ).slope.toFixed(2)}`,
    };
  });

  results['all'] = {
    successRate: (allStats.successfulRequests / allStats.totalRequests) * 100,
    fastResponseRate: (allStats.timeUnderThreshold / allStats.totalRequests) * 100,
    statusCodeTrend: `${linearRegression(
      allStats.timestamps.map((t, i) => [t, allStats.statusCodeValues[i]])
    ).slope.toFixed(2)}`,
    responseTimeTrend: `${linearRegression(
      allStats.timestamps.map((t, i) => [t, allStats.responseTimeValues[i]])
    ).slope.toFixed(2)}`,
  };

  return results;
}
