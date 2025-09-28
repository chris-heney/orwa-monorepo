import React from 'react';
import { Card, CardHeader, CardContent, Box, Chip, Divider, Typography } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { parseISO, format } from 'date-fns';

export const RecentEventsTable: React.FC = () => {
  const record = useRecordContext();
  const deliveriesFromRecord = record?.deliveries || [];
  

  if (!record) return null;

  return (
    <Card>
      <CardHeader title="Recent Events" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} subheader={`Latest events for topic: ${record.topic?.name}`} />
      <CardContent sx={{ p: 0 }}>
        {deliveriesFromRecord.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}><Typography color="text.secondary">No events found</Typography></Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
            {deliveriesFromRecord.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((event: any, index: number) => (
              <Box key={event.id || `event-${index}`}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      Event #{event.id || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.createdAt ? format(parseISO(event.createdAt), 'MMM dd, yyyy HH:mm:ss') : 'Unknown date'}
                    </Typography>
                    {event.payload && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {(() => {
                          const payloadStr = typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload);
                          return payloadStr.length > 160 ? `${payloadStr.substring(0, 160)}...` : payloadStr;
                        })()}
                      </Typography>
                    )}
                  </Box>
                  <Chip label="Published" size="small" color="success" variant="outlined" />
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

export default RecentEventsTable;


