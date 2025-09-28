import React from 'react';
import { Grid2 } from '@mui/material';
import { useGetList, useRecordContext } from 'react-admin';
import { format, parseISO } from 'date-fns';
import MetricCard from './MetricCard';
import { Notifications as NotificationsIcon, CheckCircle as SuccessIcon, Error as ErrorIcon, Schedule as ScheduleIcon, Speed as SpeedIcon } from '@mui/icons-material';

export const SubscriberMetrics: React.FC = () => {
  const record = useRecordContext();
  const deliveriesFromRecord = React.useMemo(() => record?.deliveries || [], [record?.deliveries]);
  const { data: fetchedDeliveries = [] } = useGetList(
    'pub-sub-delivery',
    {
      filter: { subscriberId: record?.id },
      sort: { field: 'createdAt', order: 'DESC' },
      pagination: { page: 1, perPage: 100 },
    },
    { enabled: deliveriesFromRecord.length === 0 && !!record?.id }
  );
  const { data: events = [] } = useGetList('pub-sub-event', {
    filter: { topicId: record?.topicId },
    sort: { field: 'createdAt', order: 'DESC' },
    pagination: { page: 1, perPage: 50 },
  });

  const metrics = React.useMemo(() => {
    const deliveries = deliveriesFromRecord.length > 0 ? deliveriesFromRecord : fetchedDeliveries;
    const totalDeliveries = deliveries.length;
    const successfulDeliveries = deliveries.filter((d: any) => (d?.status || '').toUpperCase() === 'DELIVERED').length;
    const successRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries) * 100 : 0;
    const lastDelivery = deliveries[0];
    const avgAttempts = totalDeliveries > 0 ? deliveries.reduce((sum: number, d: any) => sum + (d?.attempts || 1), 0) / totalDeliveries : 0;
    return { totalEvents: events.length, totalDeliveries, successRate, lastDelivery, avgAttempts, errorRate: 100 - successRate };
  }, [deliveriesFromRecord, fetchedDeliveries, events]);

  if (!record) return null;

  return (
    <Grid2 container spacing={3} sx={{ mb: 3 }}>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard title="Total Events" value={metrics.totalEvents} subtitle="Events received for this topic" color="primary" icon={<NotificationsIcon />} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard title="Success Rate" value={`${metrics.successRate.toFixed(1)}%`} subtitle={`${metrics.totalDeliveries} total deliveries`} color={metrics.successRate > 90 ? 'success' : metrics.successRate > 70 ? 'warning' : 'error'} icon={metrics.successRate > 90 ? <SuccessIcon /> : <ErrorIcon />} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard title="Avg Attempts" value={metrics.avgAttempts.toFixed(1)} subtitle="Average delivery attempts" color={metrics.avgAttempts <= 1.5 ? 'success' : 'warning'} icon={<SpeedIcon />} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard title="Last Delivery" value={metrics.lastDelivery ? 'Recent' : 'None'} subtitle={metrics.lastDelivery ? `${format(parseISO(metrics.lastDelivery.createdAt), 'MMM dd, HH:mm')}` : 'No deliveries yet'} color={metrics.lastDelivery ? ((metrics.lastDelivery.status || '').toUpperCase() === 'DELIVERED' ? 'success' : 'error') : 'warning'} icon={<ScheduleIcon />} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard title="Status" value={record.isActive ? 'Active' : 'Inactive'} subtitle={`Endpoint: ${record.type}`} color={record.isActive ? 'success' : 'error'} icon={record.isActive ? <SuccessIcon /> : <ErrorIcon />} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard title="Error Rate" value={`${metrics.errorRate.toFixed(1)}%`} subtitle="Failed delivery percentage" color={metrics.errorRate < 10 ? 'success' : metrics.errorRate < 30 ? 'warning' : 'error'} icon={<ErrorIcon />} />
      </Grid2>
    </Grid2>
  );
};

export default SubscriberMetrics;


