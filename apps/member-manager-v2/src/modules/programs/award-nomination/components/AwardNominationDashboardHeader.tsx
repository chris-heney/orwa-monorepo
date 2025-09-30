import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  FilterList as FilterListIcon,
  Email as EmailIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAwardNominationContext } from '../AwardNominationContextProvider';

const AwardNominationDashboardHeader = () => {
  const {
    totalNominations,
    pendingCount,
    winnersCount,
    notSelectedCount,
    underReviewCount,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    isEmailSidebarOpen,
    setIsEmailSidebarOpen,
    isActivitySidebarOpen,
    setIsActivitySidebarOpen,
  } = useAwardNominationContext();

  const stats = [
    { label: 'Total Nominations', value: totalNominations, color: '#2196f3' },
    { label: 'Pending Review', value: pendingCount, color: '#ff9800' },
    { label: 'Under Review', value: underReviewCount, color: '#9c27b0' },
    { label: 'Winners', value: winnersCount, color: '#4caf50' },
    { label: 'Not Selected', value: notSelectedCount, color: '#f44336' },
  ];

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiEventsIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">
            Award Nominations Dashboard
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Toggle Filters">
            <IconButton
              onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
              color={isFilterSidebarOpen ? 'primary' : 'default'}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Email Management">
            <IconButton
              onClick={() => setIsEmailSidebarOpen(!isEmailSidebarOpen)}
              color={isEmailSidebarOpen ? 'primary' : 'default'}
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Activity Feed">
            <IconButton
              onClick={() => setIsActivitySidebarOpen(!isActivitySidebarOpen)}
              color={isActivitySidebarOpen ? 'primary' : 'default'}
            >
              <TimelineIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reports">
            <IconButton>
              <AssessmentIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: stat.color,
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography variant="body2">
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default AwardNominationDashboardHeader;
