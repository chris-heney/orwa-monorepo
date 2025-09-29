import React from 'react';
  import { List, RaRecord } from 'react-admin';
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import CorporateSponsorsGrid from './_components/CorporateSponsorsGrid';
import { CorporateSponsorsContextProvider, useCorporateSponsorsContext } from './CorporateSponsorsContext';
import CorporateSponsorsHeader from './components/CorporateSponsorsHeader';
import CorporateSponsorsFilters from './components/CorporateSponsorsFilters';
import CorporateSponsorsAccordionFilter from './components/CorporateSponsorsAccordionFilter';
import exportCorporateSponsors from './helpers/exportCorporateSponsors';

const CorporateSponsorsListContent = () => {
  const { isFilterSidebarOpen } = useCorporateSponsorsContext();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: isSmall ? 'flex-column' : 'flex',
          flexGrow: 1,
          justifyContent: 'start',
          gap: 2,
          overflow: 'scroll',
        }}
      >
       
            <Box
              sx={{
                pb: 2,
                overflow: "hidden",
                flexGrow: "1",
                backgroundColor: "transparent",
                maxWidth: isSmall || isFilterSidebarOpen ? "95vw" : "80vw",
              }}
            >
            {isSmall && <CorporateSponsorsAccordionFilter />}
            <CorporateSponsorsHeader />
            <CorporateSponsorsGrid />
          </Box>

          {!isSmall && <CorporateSponsorsFilters />}
      </Box>
    </Box>
  );
};

const CorporateSponsorsList = () => {
  const exporter = async (records: RaRecord[]) => {
    if (records && records.length > 0) {
      await exportCorporateSponsors(records, "Corporate-Sponsors");
    }
  }

  return (
    <CorporateSponsorsContextProvider>
       <List
          disableSyncWithLocation={true}
          resource="corporate-sponsors"
          exporter={exporter}
          queryOptions={{
            meta: {
              raw: true
            }
          }}
          perPage={50}
          actions={false}
          component="div"
          title="Corporate Sponsors"
        >
      <CorporateSponsorsListContent />
        </List>
    </CorporateSponsorsContextProvider>
  );
};

export default CorporateSponsorsList; 