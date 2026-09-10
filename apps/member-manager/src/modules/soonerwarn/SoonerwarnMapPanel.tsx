import React from 'react';
import { Box } from '@mui/material';

/** Map tab: the public SoonerWARN map embedded from orwa.org. */
const SoonerwarnMapPanel = () => (
  <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
    <iframe
      src="https://orwa.org/soonerwarn-map/"
      title="SoonerWARN Map"
      width="100%"
      height="600"
      style={{ border: 0, display: 'block' }}
      allowFullScreen
    />
  </Box>
);

export default SoonerwarnMapPanel;
