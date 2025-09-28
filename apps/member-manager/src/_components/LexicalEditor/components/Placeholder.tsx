import React from 'react';
import { Box } from '@mui/material';

interface PlaceholderProps {
  text?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ text }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 8,
      left: 12,
      color: 'text.disabled',
      pointerEvents: 'none',
      fontSize: 14,
    }}
  >
    {text || 'Start typing...'}
  </Box>
);

export default Placeholder;
