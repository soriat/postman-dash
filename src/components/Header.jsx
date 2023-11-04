import { Box, Typography } from '@mui/material';

const Header = ({ title, subtitle, child }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      gap="10px"
      width="100%"
    >
      <Typography variant="h3" fontWeight="600">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="400" sx={{ flexGrow: 1 }}>
        ({subtitle})
      </Typography>
      <Box style={{ marginBottom: '-45px', width: '100px', zIndex: 1 }}>{child}</Box>
    </Box>
  );
};

export default Header;
