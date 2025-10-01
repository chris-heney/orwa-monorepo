import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  FilterList as FilterListIcon,
  Email as EmailIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useScholarshipContext } from '../ScholarshipContextProvider';

const ScholarshipDashboardHeader = () => {
  const {
    totalApplications,
    pendingCount,
    approvedCount,
    deniedCount,
    reviewCount,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    isEmailSidebarOpen,
    setIsEmailSidebarOpen,
    isActivitySidebarOpen,
    setIsActivitySidebarOpen,
  } = useScholarshipContext();

  const theme = useTheme();
  const stats = [
    { label: 'Total Applications', value: totalApplications, color: theme.palette.primary.main },
    { label: 'Pending Review', value: pendingCount, color: theme.palette.warning.main },
    { label: 'Under Review', value: reviewCount, color: theme.palette.secondary.main },
    { label: 'Approved', value: approvedCount, color: theme.palette.success.main },
    { label: 'Denied', value: deniedCount, color: theme.palette.error.main },
  ];

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">
            Scholarship Applications Dashboard
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

export default ScholarshipDashboardHeader;
