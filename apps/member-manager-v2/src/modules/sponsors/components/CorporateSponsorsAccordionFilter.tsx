import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FilterList, FilterListItem, FilterLiveSearch } from 'react-admin';
import ActiveIcon from "@mui/icons-material/CheckCircle";
import { isSelected, toggleFilter } from '../../conference/helpers/selectFilters';

const CorporateSponsorsAccordionFilter = () => {
  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Filters</Typography>
      </AccordionSummary>
      <AccordionDetails>
      <FilterLiveSearch
          source="name][$contains"
          label="Search by Name"
          alwaysOn
        />

        <Divider sx={{ mb: 2 }} />

        <FilterList label="Status" icon={<ActiveIcon />}>
          <FilterListItem
            label="Active"
            value={{ active: true }}
            isSelected={isSelected}
            toggleFilter={(val, filters) =>
              toggleFilter(val, filters, undefined, false)
            }
          />
          <FilterListItem
            label="Inactive"
            value={{ active: false }}
            isSelected={isSelected}
            toggleFilter={(val, filters) =>
              toggleFilter(val, filters, undefined, false)
            }
          />
          {/* <FilterListItem label="All" value={{}} /> */}
        </FilterList>
      </AccordionDetails>
    </Accordion>
  );
};

export default CorporateSponsorsAccordionFilter; 