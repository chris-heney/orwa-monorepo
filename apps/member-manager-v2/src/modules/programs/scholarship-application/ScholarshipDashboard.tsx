import React from 'react';
import { Box, Tab, Divider } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import {
  Dashboard as DashboardIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RateReview as RateReviewIcon,
} from '@mui/icons-material';
import { Title } from 'react-admin';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { ScholarshipContextProvider, useScholarshipContext, TabValue } from './ScholarshipContextProvider';
import ScholarshipDashboardHeader from './components/ScholarshipDashboardHeader';
import ScholarshipFilterSidebar from './components/ScholarshipFilterSidebar';
import ScholarshipApplicationList from './ScholarshipApplicationList';
import EmailSidebar from '../../emails-magement/EmailSidebar';
import ActivityFeed from '../../activity/ActivityFeed';
import { a11yTabPanelProps, a11yTabProps } from '../../../helpers/TabFormatters';
import ScholarshipSummary from './components/ScholarshipSummary';

const ScholarshipDashboardContent = () => {
  const {
    selectedTab,
    setSelectedTab,
    isFilterSidebarOpen,
    isEmailSidebarOpen,
    isActivitySidebarOpen,
    statusFilter,
  } = useScholarshipContext();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  const tabs = [
    {
      label: 'Summary',
      value: 'summary',
      icon: <DashboardIcon />,
    },
    {
      label: 'All Applications',
      value: 'applications',
      icon: <ListAltIcon />,
    },
    {
      label: 'Under Review',
      value: 'review',
      icon: <RateReviewIcon />,
    },
    {
      label: 'Approved',
      value: 'approved',
      icon: <CheckCircleIcon />,
    },
    {
      label: 'Denied',
      value: 'denied',
      icon: <CancelIcon />,
    },
  ];

  const getFilterForTab = (tab: TabValue) => {
    switch (tab) {
      case 'review':
        return { application_status: ['Under Review', 'Submitted'] };
      case 'approved':
        return { application_status: 'Approved' };
      case 'denied':
        return { application_status: 'Denied' };
      case 'applications':
        return statusFilter.length > 0 ? { application_status: statusFilter } : {};
      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmall ? 'column' : 'row',
        gap: 2,
        width: '100%',
        maxWidth: '95vw',
        overflow: 'hidden',
      }}
    >
      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'hidden',
        minWidth: 0, // This is important for flex children to shrink below their content size
        maxWidth: isFilterSidebarOpen || isEmailSidebarOpen || isActivitySidebarOpen 
          ? 'calc(100vw - 400px)' 
          : '100%',
      }}>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f5f5f5' }}>
          <ScholarshipDashboardHeader />
          <Title title="Scholarship Applications" />
          
          <TabContext value={selectedTab}>
            <TabList
              variant="scrollable"
              sx={{ backgroundColor: '#fff', borderBottom: 1, borderColor: 'divider' }}
              onChange={(event: React.SyntheticEvent, value: TabValue) => {
                setSelectedTab(value);
              }}
            >
              {tabs.map((tab, i) => (
                <Tab
                  key={`tab-${i}`}
                  label={tab.label}
                  {...a11yTabProps(i)}
                  value={tab.value}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </TabList>
          </TabContext>
          <Divider />
        </Box>

        <Box sx={{ 
          pb: 2, 
          overflow: 'hidden', 
          width: '100%',
          position: 'relative',
        }}>
          <TabContext value={selectedTab}>
            <TabPanel 
              value="summary" 
              {...a11yTabPanelProps(0)} 
              sx={{ 
                padding: '24px 0',
                width: '100%',
                overflow: 'auto',
                maxHeight: 'calc(100vh - 300px)',
              }}
            >
              <ScholarshipSummary />
            </TabPanel>
            
            <TabPanel 
              value="applications" 
              {...a11yTabPanelProps(1)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <ScholarshipApplicationList filter={getFilterForTab('applications')} />
            </TabPanel>
            
            <TabPanel 
              value="review" 
              {...a11yTabPanelProps(2)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <ScholarshipApplicationList filter={getFilterForTab('review')} />
            </TabPanel>
            
            <TabPanel 
              value="approved" 
              {...a11yTabPanelProps(3)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <ScholarshipApplicationList filter={getFilterForTab('approved')} />
            </TabPanel>
            
            <TabPanel 
              value="denied" 
              {...a11yTabPanelProps(4)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <ScholarshipApplicationList filter={getFilterForTab('denied')} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>

      {/* Sidebars */}
      {isFilterSidebarOpen && !isSmall && (
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <ScholarshipFilterSidebar />
        </Box>
      )}

      {isEmailSidebarOpen && !isSmall && (
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <EmailSidebar module="Scholarship Management" />
        </Box>
      )}

      {isActivitySidebarOpen && !isSmall && (
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <ActivityFeed
            entity="scholarship-application"
            title="Activity Feed"
            entity_id={null}
          />
        </Box>
      )}
    </Box>
  );
};

const ScholarshipDashboard = () => {
  return (
    <ScholarshipContextProvider>
      <ScholarshipDashboardContent />
    </ScholarshipContextProvider>
  );
};

export default ScholarshipDashboard;
