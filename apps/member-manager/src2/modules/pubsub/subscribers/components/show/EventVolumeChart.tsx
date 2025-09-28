import React from 'react';
import { Card, CardHeader, CardContent, Typography, useTheme, Skeleton } from '@mui/material';
import { useGetList, useRecordContext } from 'react-admin';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar } from 'recharts';

interface Props { subscriberId: string; }

export const EventVolumeChart: React.FC<Props> = ({ subscriberId }) => {
  const theme = useTheme();
  const record = useRecordContext();
  const deliveriesFromRecord = record?.deliveries || [];
  const eventsFromDeliveries = deliveriesFromRecord.map((d: any) => d.event).filter(Boolean);

  const { data: fetchedEvents = [], isLoading: isLoadingFetched } = useGetList(
    'pub-sub-event',
    {
      filter: { topicId: record?.topicId },
      sort: { field: 'createdAt', order: 'DESC' },
      pagination: { page: 1, perPage: 100 },
    },
    { enabled: eventsFromDeliveries.length === 0 && !!record?.topicId }
  );

  const events = eventsFromDeliveries.length > 0 ? eventsFromDeliveries : fetchedEvents;
  const isLoading = eventsFromDeliveries.length === 0 && isLoadingFetched;

  const chartData = React.useMemo(() => {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour.toString().padStart(2, '0')}:00`, count: 0 }));
    events.forEach((event: any) => {
      if (!event?.createdAt) return;
      const hour = new Date(event.createdAt).getHours();
      hourlyData[hour].count++;
    });
    return hourlyData;
  }, [events]);

  return (
    <Card sx={{ height: 400 }}>
      <CardHeader title="Event Volume by Hour" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Events: {chartData.reduce((sum, d) => sum + d.count, 0)} total
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="hour" stroke={theme.palette.text.secondary} interval={3} />
            <YAxis stroke={theme.palette.text.secondary} />
            <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
            <Bar dataKey="count" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EventVolumeChart;


