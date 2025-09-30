import React from 'react';
import { Box, Tab, Divider } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import {
  EmojiEvents as EmojiEventsIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RateReview as RateReviewIcon,
} from '@mui/icons-material';
import { Title } from 'react-admin';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { AwardNominationContextProvider, useAwardNominationContext, TabValue } from './AwardNominationContextProvider';
import AwardNominationDashboardHeader from './components/AwardNominationDashboardHeader';
import AwardNominationFilterSidebar from './components/AwardNominationFilterSidebar';
import AwardNominationList from './AwardNominationList';
import EmailSidebar from '../../emails-magement/EmailSidebar';
import ActivityFeed from '../../activity/ActivityFeed';
import { a11yTabPanelProps, a11yTabProps } from '../../../helpers/TabFormatters';
import AwardNominationSummary from './components/AwardNominationSummary';

const AwardNominationDashboardContent = () => {
  const {
    selectedTab,
    setSelectedTab,
    isFilterSidebarOpen,
    isEmailSidebarOpen,
    isActivitySidebarOpen,
    statusFilter,
    awardTypeFilter,
  } = useAwardNominationContext();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  const tabs = [
    {
      label: 'Summary',
      value: 'summary',
      icon: <EmojiEventsIcon />,
    },
    {
      label: 'All Nominations',
      value: 'nominations',
      icon: <ListAltIcon />,
    },
    {
      label: 'Under Review',
      value: 'under-review',
      icon: <RateReviewIcon />,
    },
    {
      label: 'Winners',
      value: 'winners',
      icon: <CheckCircleIcon />,
    },
    {
      label: 'Not Selected',
      value: 'not-selected',
      icon: <CancelIcon />,
    },
  ];

  const getFilterForTab = (tab: TabValue) => {
    switch (tab) {
      case 'under-review':
        return { nomination_status: ['Under Review', 'Submitted'] };
      case 'winners':
        return { nomination_status: ['Winner', 'Runner Up'] };
      case 'not-selected':
        return { nomination_status: 'Not Selected' };
      case 'nominations':
        const filters: any = {};
        if (statusFilter.length > 0) {
          filters.nomination_status = statusFilter;
        }
        if (awardTypeFilter.length > 0) {
          filters.award_type = awardTypeFilter;
        }
        return filters;
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
          <AwardNominationDashboardHeader />
          <Title title="Award Nominations" />
          
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
              <AwardNominationSummary />
            </TabPanel>
            
            <TabPanel 
              value="nominations" 
              {...a11yTabPanelProps(1)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <AwardNominationList filter={getFilterForTab('nominations')} />
            </TabPanel>
            
            <TabPanel 
              value="under-review" 
              {...a11yTabPanelProps(2)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <AwardNominationList filter={getFilterForTab('under-review')} />
            </TabPanel>
            
            <TabPanel 
              value="winners" 
              {...a11yTabPanelProps(3)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <AwardNominationList filter={getFilterForTab('winners')} />
            </TabPanel>
            
            <TabPanel 
              value="not-selected" 
              {...a11yTabPanelProps(4)} 
              sx={{ 
                padding: '24px 0', 
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <AwardNominationList filter={getFilterForTab('not-selected')} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>

      {/* Sidebars */}
      {isFilterSidebarOpen && !isSmall && (
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <AwardNominationFilterSidebar />
        </Box>
      )}

      {isEmailSidebarOpen && !isSmall && (
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <EmailSidebar module="Award Management" />
        </Box>
      )}

      {isActivitySidebarOpen && !isSmall && (
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <ActivityFeed
            entity="award-nomination"
            title="Activity Feed"
            entity_id={null}
          />
        </Box>
      )}
    </Box>
  );
};

const AwardNominationDashboard = () => {
  return (
    <AwardNominationContextProvider>
      <AwardNominationDashboardContent />
    </AwardNominationContextProvider>
  );
};

export default AwardNominationDashboard;
