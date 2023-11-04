import React, { createContext, useState, useContext, useEffect } from 'react';
import { filterData, getTimestamps } from '../../data/mock_data_query';
import { mockApiData } from 'data/mock_api_data';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [specificData, setSpecificData] = useState(mockApiData);
  const [filteredData, setFilteredData] = useState(mockApiData);

  const timestamps = getTimestamps();
  const unixTimestamps = timestamps.map((t) => new Date(t).getTime());
  const [sliderRange, setSliderRange] = useState([
    unixTimestamps[0],
    unixTimestamps[unixTimestamps.length - 1],
  ]);

  const [statusCodeType, setStatusCodeType] = useState('Granular');
  const [selectedStatusCodes, setSelectedStatusCodes] = useState([]);

  const uniquePaths = Array.from(new Set(mockApiData.map((item) => item.path))).sort();
  const [checkedPaths, setCheckedPaths] = useState(uniquePaths);

  const value = {
    checkedPaths,
    setCheckedPaths,
    specificData,
    setSpecificData,
    filteredData,
    setFilteredData,
    sliderRange,
    setSliderRange,
    statusCodeType,
    setStatusCodeType,
    selectedStatusCodes,
    setSelectedStatusCodes,
  };

  useEffect(() => {
    filterData({
      checkedPaths,
      sliderRange,
      statusCodeType,
      selectedStatusCodes,
      setFilteredData,
      setSpecificData,
    });
  }, [checkedPaths, sliderRange, statusCodeType, selectedStatusCodes]);

  return (
    <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
