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
import { useScholarshipContext } from '../ScholarshipContextProvider';

const ScholarshipFilterSidebar = () => {
  const { statusFilter, setStatusFilter, searchTerm, setSearchTerm } = useScholarshipContext();

  const statusOptions = [
    { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
    { value: 'Submitted', label: 'Submitted', color: '#2196f3' },
    { value: 'Under Review', label: 'Under Review', color: '#ff9800' },
    { value: 'Approved', label: 'Approved', color: '#4caf50' },
    { value: 'Denied', label: 'Denied', color: '#f44336' },
  ];

  const educationTypes = [
    { value: 'FourYearCollege', label: 'Four Year College' },
    { value: 'TwoYearCollege', label: 'Two Year College' },
    { value: 'VocationalSchool', label: 'Vocational/Technical School' },
  ];

  const relationships = [
    { value: 'Self', label: 'Self (Employee/Board Member)' },
    { value: 'DependentChild', label: 'Dependent Child' },
    { value: 'DependentGrandchild', label: 'Dependent Grandchild' },
  ];

  const handleStatusChange = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const clearAllFilters = () => {
    setStatusFilter([]);
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
          label="Search Applications"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Name, Email, School..."
        />
      </Box>

      {/* Status Filter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Application Status</Typography>
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

      {/* Education Type Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Education Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {educationTypes.map(type => (
              <FormControlLabel
                key={type.value}
                control={<Checkbox />}
                label={type.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Relationship Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Relationship</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {relationships.map(rel => (
              <FormControlLabel
                key={rel.value}
                control={<Checkbox />}
                label={rel.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* GPA Range Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">GPA Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Min GPA"
              type="number"
              inputProps={{ min: 0, max: 4, step: 0.1 }}
              size="small"
              sx={{ width: '50%' }}
            />
            <TextField
              label="Max GPA"
              type="number"
              inputProps={{ min: 0, max: 4, step: 0.1 }}
              size="small"
              sx={{ width: '50%' }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Document Status */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Document Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Complete Applications" />
            <FormControlLabel control={<Checkbox />} label="Missing Documents" />
            <FormControlLabel control={<Checkbox />} label="Missing Transcript" />
            <FormControlLabel control={<Checkbox />} label="Missing Recommendations" />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default ScholarshipFilterSidebar;
