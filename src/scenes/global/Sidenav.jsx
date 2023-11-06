import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Link,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { mockApiData } from 'data/mock_api_data';
import { analyzeApiData } from 'data/mock_data_query';
import React, { useState } from 'react';

import EndpointData from 'components/EndpointData';
import { useGlobalState } from './GlobalStateProvider';

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: selected === title ? 'primary.main' : 'text.primary',
        fontWeight: selected === title ? 'bold' : 'normal',
        '&:hover': {
          color: 'primary.dark',
        },
      }}
      onClick={() => setSelected(title)}
    >
      {icon}
      <Typography variant="h4" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
  );
};

export default function Sidenav() {
  const [selected, setSelected] = useState('Dashboard');
  const [open, setOpen] = useState(true);

  const uniquePaths = Array.from(new Set(mockApiData.map((item) => item.path))).sort();
  const { filteredData, checkedPaths, setCheckedPaths } = useGlobalState();

  const handleToggle = (path) => {
    const currentIndex = checkedPaths.indexOf(path);
    const newChecked = [...checkedPaths];

    if (currentIndex === -1) {
      newChecked.push(path);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedPaths(newChecked);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSelectAllToggle = () => {
    if (checkedPaths.length < uniquePaths.length) {
      setCheckedPaths(uniquePaths);
    } else {
      setCheckedPaths([]);
    }
  };
  const dataAnalytics = analyzeApiData(filteredData);

  return (
    <>
      <Box
        sx={{
          width: '200px',
          height: '100vh',
          marginRight: '40px',
        }}
      ></Box>
      <Box
        sx={{
          width: '200px',
          height: '100vh',
          bgcolor: 'background.paper',
          overflow: 'auto',
          position: 'fixed',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Link
            href="https://github.com/soriat/postman-dash"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            <Typography variant="h4">Postman Takehome</Typography>
          </Link>
        </Box>
        <List>
          <ListItemButton onClick={handleClick}>
            <Item
              title="Dashboard"
              to="/postman-dash"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ListItem
              sx={{
                pl: '20px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    indeterminate={
                      checkedPaths.length > 0 && checkedPaths.length < uniquePaths.length
                    }
                    checked={checkedPaths.length === uniquePaths.length}
                    onChange={handleSelectAllToggle}
                  />
                }
                label={
                  checkedPaths.length === uniquePaths.length
                    ? 'Deselect All'
                    : 'Select All'
                }
              />
            </ListItem>
            {checkedPaths.length > 1 && (
              <Box sx={{ marginTop: '-10px', pl: '20px' }}>
                <EndpointData data={dataAnalytics['all']} />
              </Box>
            )}
            <FormGroup sx={{ pl: '20px' }}>
              {uniquePaths.map((path) => (
                <React.Fragment key={path}>
                  <FormControlLabel
                    label={path}
                    control={
                      <Checkbox
                        checked={checkedPaths.includes(path)}
                        onChange={() => handleToggle(path)}
                        value={path}
                      />
                    }
                    sx={{
                      '& .MuiTypography-body1': {
                        fontSize: '14px',
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      '& .Mui-checked + .MuiFormControlLabel-label': {
                        fontWeight: 'bold',
                      },
                    }}
                  />
                  {checkedPaths.includes(path) && (
                    <EndpointData
                      identifier={`${path}.data`}
                      data={dataAnalytics[path]}
                    />
                  )}
                </React.Fragment>
              ))}
            </FormGroup>
          </Collapse>
        </List>
      </Box>
    </>
  );
}
