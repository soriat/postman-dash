import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useState } from 'react';

import { Box } from '@mui/material';
import { mockApiData } from 'data/mock_api_data';
import { useGlobalState } from './GlobalStateProvider';

export default function StatusCodeTypeSelector() {
  const {
    specificData,
    statusCodeType,
    setStatusCodeType,
    selectedStatusCodes,
    setSelectedStatusCodes,
  } = useGlobalState();

  const presentInDataset = Array.from(
    new Set(specificData.map((item) => item.status_code))
  ).sort();

  const notPresentInDataset = Array.from(
    new Set(mockApiData.map((item) => item.status_code))
  )
    .sort()
    .filter((code) => !presentInDataset.includes(code));

  const allStatusCodes = [...presentInDataset, ...notPresentInDataset].sort();

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedStatusCodes(allStatusCodes);
    } else {
      setSelectedStatusCodes([]);
    }
  };

  const handleSelection = (event) => {
    const value = event.target.value;
    if (value === selectedStatusCodes || value[value.length - 1] === 'all') {
      if (selectAll) {
        setSelectedStatusCodes([]);
      } else {
        setSelectedStatusCodes(allStatusCodes);
      }
      setSelectAll(!selectAll);
    } else {
      setSelectedStatusCodes(value.sort());
      setSelectAll(value.length === allStatusCodes.length);
    }
  };

  return (
    <>
      <Box
        gridColumn="span 2"
        bgcolor="background.secondary"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={2}
        width="100%"
      >
        <FormControl fullWidth>
          <InputLabel id="status-code-type-label">Status Code Filters</InputLabel>
          <Select
            labelId="status-code-type-label"
            id="status-code-type-select"
            value={statusCodeType}
            label="Status Code Filters"
            onChange={(event) => setStatusCodeType(event.target.value)}
          >
            <MenuItem value="Granular">Granular</MenuItem>
            <MenuItem value="Combined">Combined</MenuItem>
            <MenuItem value="Successes">Successes</MenuItem>
            <MenuItem value="Failures">Failures</MenuItem>
            <MenuItem value="Specific">Specific</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        gridColumn="span 2"
        bgcolor="background.secondary"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={2}
        width="100%"
      >
        <FormControl fullWidth disabled={statusCodeType !== 'Specific'}>
          <InputLabel id="status-code-select-label">Status Codes</InputLabel>
          <Select
            labelId="status-code-select-label"
            id="status-code-select"
            multiple
            value={selectedStatusCodes}
            onChange={handleSelection}
            input={<OutlinedInput label="Status Codes" />}
            renderValue={(selected) => {
              if (selected.length === allStatusCodes.length) {
                return 'All';
              }

              return selected.join(', ');
            }}
          >
            <MenuItem value="all">
              <Checkbox checked={selectAll} onChange={handleSelectAll} />
              <ListItemText primary={selectAll ? 'Deselect All' : 'Select All'} />
            </MenuItem>
            <ListSubheader>Present in data-set</ListSubheader>
            {presentInDataset.map((code) => (
              <MenuItem key={code} value={code}>
                <Checkbox checked={selectedStatusCodes.indexOf(code) > -1} />
                <ListItemText primary={code} />
              </MenuItem>
            ))}

            <ListSubheader>Not Present in data-set</ListSubheader>
            {notPresentInDataset.map((code) => (
              <MenuItem key={code} value={code}>
                <Checkbox checked={selectedStatusCodes.indexOf(code) > -1} />
                <ListItemText primary={code} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
