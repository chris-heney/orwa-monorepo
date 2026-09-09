import React from 'react';
import { Box } from '@mui/material';
import CorporateSponsorsGrid from './_components/CorporateSponsorsGrid';

/**
 * Body of the `corporate-sponsors.list` page. The list scope (resource,
 * exporter, filters drawer) and the heading bar come from the manifest.
 */
const CorporateSponsorsList = () => (
  <Box sx={{ px: 2, pb: 2 }}>
    <CorporateSponsorsGrid />
  </Box>
);

export default CorporateSponsorsList;
