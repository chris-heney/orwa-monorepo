import React from 'react';
import { Card, CardHeader, CardContent, IconButton, Tooltip, Typography, useTheme, Skeleton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useGetList, useRecordContext } from 'react-admin';
import { format, parseISO, subDays } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface Props { subscriberId: string; }

export const DeliveryChart: React.FC<Props> = ({ subscriberId }) => {
  const theme = useTheme();
  const record = useRecordContext();
  const deliveriesFromRecord = record?.deliveries || [];
  const { data: fetchedDeliveries = [], isLoading: isLoadingFetched } = useGetList(
    'pub-sub-delivery',
    {
      filter: { subscriberId },
      sort: { field: 'createdAt', order: 'DESC' },
      pagination: { page: 1, perPage: 100 },
    },
    {
      enabled: deliveriesFromRecord.length === 0 && !!subscriberId,
    }
  );
  const deliveries = deliveriesFromRecord.length > 0 ? deliveriesFromRecord : fetchedDeliveries;
  const isLoading = deliveriesFromRecord.length === 0 && isLoadingFetched;

  const chartData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return { date: format(date, 'MMM dd'), successful: 0, failed: 0, total: 0 };
    }).reverse();

    deliveries.forEach((delivery: any) => {
      const deliveryDate = delivery?.createdAt ? format(parseISO(delivery.createdAt), 'MMM dd') : '';
      const dayData = last7Days.find(d => d.date === deliveryDate);
      if (dayData) {
        dayData.total++;
        if ((delivery?.status || '').toUpperCase() === 'DELIVERED') {
          dayData.successful++;
        } else {
          dayData.failed++;
        }
      }
    });
    return last7Days;
  }, [deliveries]);

  return (
    <Card sx={{ height: 400 }}>
      <CardHeader
        title="Delivery Success Rate (Last 7 Days)"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        action={
          <Tooltip title="Refresh data">
            <IconButton size="small"><RefreshIcon /></IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Data points: {chartData.filter(d => d.total > 0).length} / {chartData.length} | Total deliveries processed: {chartData.reduce((sum, d) => sum + d.total, 0)}
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
            <Legend />
            <Area type="monotone" dataKey="successful" stackId="1" stroke={theme.palette.success.main} fill="url(#successGradient)" name="Successful" />
            <Area type="monotone" dataKey="failed" stackId="1" stroke={theme.palette.error.main} fill="url(#errorGradient)" name="Failed" />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryChart;


