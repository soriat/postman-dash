import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#67be23',
    contrastText: '#fff',
  },
  secondary: {
    main: '#2A132E',
    contrastText: '#fff',
  },
  background: {
    default: '#f0f0f0',
    secondary: '#ffffff',
  },
};

export const themeSettings = (mode) => {
  return {
    palette: {
      ...lightPalette,
    },
    typography: {
      fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
        fontSize: 14,
      },
    },
  };
};

export const getTheme = () => {
  return createTheme(themeSettings('light'));
};

export const getChartTheme = () => {
  return {
    fontSize: 13,
    tooltip: {
      container: {
        boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
        borderRadius: '4px',
      },
    },
  };
};
