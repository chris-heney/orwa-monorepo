import React from 'react';
import {
  Box,
  Card,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DateInput } from 'react-admin';
import { useAwardNominationContext } from '../AwardNominationContextProvider';

const AwardNominationFilterSidebar = () => {
  const { 
    statusFilter, 
    setStatusFilter, 
    awardTypeFilter, 
    setAwardTypeFilter, 
    searchTerm, 
    setSearchTerm 
  } = useAwardNominationContext();

  const statusOptions = [
    { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
    { value: 'Submitted', label: 'Submitted', color: '#2196f3' },
    { value: 'Under Review', label: 'Under Review', color: '#ff9800' },
    { value: 'Winner', label: 'Winner', color: '#4caf50' },
    { value: 'Runner Up', label: 'Runner Up', color: '#8bc34a' },
    { value: 'Not Selected', label: 'Not Selected', color: '#f44336' },
  ];

  const awardTypes = [
    { value: 'Water/Wastewater System of the Year', label: 'Water/Wastewater System of the Year' },
    { value: 'Excellence in Operations', label: 'Excellence in Operations' },
    { value: 'Excellence in Management', label: 'Excellence in Management' },
    { value: 'Excellence in Office Operations', label: 'Excellence in Office Operations' },
  ];

  const oklahomaCounties = [
    "Adair", "Alfalfa", "Atoka", "Beaver", "Beckham", "Blaine", "Bryan", "Caddo",
    "Canadian", "Carter", "Cherokee", "Choctaw", "Cimarron", "Cleveland", "Coal",
    "Comanche", "Cotton", "Craig", "Creek", "Custer", "Delaware", "Dewey", "Ellis",
    "Garfield", "Garvin", "Grady", "Grant", "Greer", "Harmon", "Harper", "Haskell",
    "Hughes", "Jackson", "Jefferson", "Johnston", "Kay", "Kingfisher", "Kiowa",
    "Latimer", "LeFlore", "Lincoln", "Logan", "Love", "Major", "Marshall", "Mayes",
    "McClain", "McCurtain", "McIntosh", "Murray", "Muskogee", "Noble", "Nowata",
    "Okfuskee", "Oklahoma", "Okmulgee", "Osage", "Ottawa", "Pawnee", "Payne",
    "Pittsburg", "Pontotoc", "Pottawatomie", "Pushmataha", "Roger Mills", "Rogers",
    "Seminole", "Sequoyah", "Stephens", "Texas", "Tillman", "Tulsa", "Wagoner",
    "Washington", "Washita", "Woods", "Woodward"
  ];

  const handleStatusChange = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const handleAwardTypeChange = (type: string) => {
    if (awardTypeFilter.includes(type)) {
      setAwardTypeFilter(awardTypeFilter.filter(t => t !== type));
    } else {
      setAwardTypeFilter([...awardTypeFilter, type]);
    }
  };

  const clearAllFilters = () => {
    setStatusFilter([]);
    setAwardTypeFilter([]);
    setSearchTerm('');
  };

  return (
    <Card sx={{ width: 300, height: 'calc(100vh - 100px)', overflow: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon />
          Filters
        </Typography>
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Nominations"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Name, System, County..."
        />
      </Box>

      {/* Status Filter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Nomination Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {statusOptions.map(option => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={statusFilter.includes(option.value)}
                    onChange={() => handleStatusChange(option.value)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      sx={{
                        backgroundColor: option.color,
                        color: 'white',
                        height: 20,
                      }}
                    />
                    {option.label}
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Award Type Filter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Award Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {awardTypes.map(type => (
              <FormControlLabel
                key={type.value}
                control={
                  <Checkbox
                    checked={awardTypeFilter.includes(type.value)}
                    onChange={() => handleAwardTypeChange(type.value)}
                  />
                }
                label={type.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Date Range Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Submission Date</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DateInput source="date_from" label="From" />
            <DateInput source="date_to" label="To" />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* County Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">County</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {oklahomaCounties.slice(0, 10).map(county => (
              <FormControlLabel
                key={county}
                control={<Checkbox />}
                label={county}
              />
            ))}
            <Typography variant="caption" color="textSecondary">
              Showing first 10 counties. Use search for specific county.
            </Typography>
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Year Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Award Year</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="From Year"
              type="number"
              inputProps={{ min: 2020, max: 2030 }}
              size="small"
              sx={{ width: '50%' }}
            />
            <TextField
              label="To Year"
              type="number"
              inputProps={{ min: 2020, max: 2030 }}
              size="small"
              sx={{ width: '50%' }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Employee Count Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">System Size</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Small Systems (1-10 employees)" />
            <FormControlLabel control={<Checkbox />} label="Medium Systems (11-50 employees)" />
            <FormControlLabel control={<Checkbox />} label="Large Systems (50+ employees)" />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Document Status */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Document Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Complete Nominations" />
            <FormControlLabel control={<Checkbox />} label="Missing Documents" />
            <FormControlLabel control={<Checkbox />} label="Has PDF" />
            <FormControlLabel control={<Checkbox />} label="Has Supporting Docs" />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default AwardNominationFilterSidebar;
