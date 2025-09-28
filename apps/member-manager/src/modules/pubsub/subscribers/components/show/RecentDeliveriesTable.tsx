import React from 'react';
import { Card, CardHeader, CardContent, Box, Chip, Divider, Typography } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { parseISO, format } from 'date-fns';

export const RecentDeliveriesTable: React.FC = () => {
  const record = useRecordContext();
  const deliveriesFromRecord = (record?.deliveries)


  if (!record) return null;

  const getStatusColor = (status: string) => {
    switch ((status || '').toUpperCase()) {
      case 'DELIVERED': return 'success';
      case 'FAILED': return 'error';
      case 'PENDING': return 'warning';
      case 'ENQUEUED': return 'info';
      case 'RETRYING': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader title="Recent Deliveries" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} subheader="Latest delivery attempts for this subscriber" />
      <CardContent sx={{ p: 0 }}>
        {deliveriesFromRecord.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}><Typography color="text.secondary">No deliveries found</Typography></Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
            {deliveriesFromRecord.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((delivery: any, index: number) => (
              <Box key={delivery.id || `delivery-${index}`}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        Delivery #{delivery.id || 'Unknown'}
                      </Typography>
                      <Chip label={delivery.status || 'UNKNOWN'} size="small" color={getStatusColor(delivery.status) as any} variant="outlined" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {delivery.createdAt ? format(parseISO(delivery.createdAt), 'MMM dd, yyyy HH:mm:ss') : 'Unknown date'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="caption">Attempts: {delivery.attempts || 1}</Typography>
                      {delivery.lastError && (
                        <Typography variant="caption" color="error.main" sx={{ wordBreak: 'break-word' }}>
                          Error: {delivery.lastError.length > 120 ? `${delivery.lastError.substring(0, 120)}...` : delivery.lastError}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                {index < deliveriesFromRecord.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDeliveriesTable;


