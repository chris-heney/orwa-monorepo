import React, { useState } from 'react';
import { Show, useShowContext } from 'react-admin';
import { Box, Grid2, Typography, useTheme, Paper, Tab, Tabs, useMediaQuery } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import {
  SubscriberMetrics,
  DeliveryChart,
  DeliveryAttemptsChart,
  EventVolumeChart,
  RecentEventsTable,
  RecentDeliveriesTable,
  SubscriberConfiguration,
} from './components/show';

const SubscriberShowContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const { record } = useShowContext();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, overflowX: 'hidden' }}>
      <Paper elevation={0} sx={{ mb: 3, p: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: 3, backgroundColor: theme.palette.primary.main, color: 'white', boxShadow: `0 4px 12px ${theme.palette.primary.main}30` }}>
            <NotificationsIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} gutterBottom>
              Topic Analytics for "{(record?.topic?.name || 'Subscriber').replace(/_/g, ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}"
            </Typography>
            <Typography variant="body1" color="text.secondary">Comprehensive analytics and monitoring for this subscriber</Typography>
          </Box>
        </Box>
      </Paper>

      <SubscriberMetrics />

      {isMobile && (
        <Paper
          sx={{
            mb: 3,
            zIndex: theme => theme.zIndex.appBar,
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            backgroundColor: theme => theme.palette.background.paper,
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Charts" />
            <Tab label="Data" />
            <Tab label="Config" />
          </Tabs>
        </Paper>
      )}

      {(!isMobile || tabValue === 0) && record && (
        <Grid2 container spacing={3} sx={{ mb: 3 }}>
          <Grid2 size={{ xs: 12, lg: 8 }}>
            <DeliveryChart subscriberId={record.id.toString()} />
          </Grid2>
          <Grid2 size={{ xs: 12, lg: 4 }}>
            <DeliveryAttemptsChart subscriberId={record.id.toString()} />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <EventVolumeChart subscriberId={record.id.toString()} />
          </Grid2>
        </Grid2>
      )}

      {(!isMobile || tabValue === 1) && (
        <Grid2 container spacing={3} sx={{ mb: 3, overflowX: 'hidden' }}>
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <RecentEventsTable />
          </Grid2>
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <RecentDeliveriesTable />
          </Grid2>
        </Grid2>
      )}

      {(!isMobile || tabValue === 2) && <SubscriberConfiguration />}
    </Box>
  );
};

export const SubscriberShow: React.FC<any> = props => (
  <Show
    title="Subscriber Details"
    component={'div'}
    queryOptions={{ meta: { populate: ['topic', 'deliveries.event'], raw: true } }}
  >
    <SubscriberShowContent {...props} />
  </Show>
);

export default SubscriberShow;


