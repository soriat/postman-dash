import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import StatusCodeTypeSelector from './StatusCodeFilter';
import TimestampRangeSlider from './TimestampRangeSlider';

export default function FilterBar() {
  const fixedBoxRef = useRef(null);
  const [fixedBoxHeight, setFixedBoxHeight] = useState(0);

  useEffect(() => {
    if (fixedBoxRef.current) {
      setFixedBoxHeight(fixedBoxRef.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <Box style={{ height: fixedBoxHeight, margin: '20px' }}></Box>

      <Box
        ref={fixedBoxRef}
        position="fixed"
        top={0}
        left={'200px'}
        zIndex={1100}
        width="calc(100% - 200px)"
        style={{ backgroundColor: '#f0f0f0' }}
      >
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="80px"
          gap="20px"
          p="20px"
        >
          <TimestampRangeSlider />
          <StatusCodeTypeSelector />
        </Box>
      </Box>
    </>
  );
}
