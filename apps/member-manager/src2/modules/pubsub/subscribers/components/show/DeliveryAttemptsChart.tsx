import React from 'react';
import { Card, CardHeader, CardContent, useTheme, Skeleton } from '@mui/material';
import { useGetList, useRecordContext } from 'react-admin';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

interface Props { subscriberId: string; }

export const DeliveryAttemptsChart: React.FC<Props> = ({ subscriberId }) => {
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
    { enabled: deliveriesFromRecord.length === 0 && !!subscriberId }
  );
  const deliveries = deliveriesFromRecord.length > 0 ? deliveriesFromRecord : fetchedDeliveries;
  const isLoading = deliveriesFromRecord.length === 0 && isLoadingFetched;

  const chartData = React.useMemo(() => {
    const attemptsData = deliveries.reduce((acc: any, delivery: any) => {
      const attempts = delivery?.attempts ?? 1;
      const key = attempts === 1 ? '1 attempt' : attempts > 3 ? '3+ attempts' : `${attempts} attempts`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(attemptsData).map(([name, value]) => ({ name, value }));
  }, [deliveries]);

  const COLORS = [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];

  return (
    <Card sx={{ height: 400 }}>
      <CardHeader title="Delivery Attempts Distribution" />
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} outerRadius={80} fill="#8884d8" dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryAttemptsChart;


