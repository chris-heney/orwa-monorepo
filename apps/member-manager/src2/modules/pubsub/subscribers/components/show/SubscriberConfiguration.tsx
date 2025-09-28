import React from 'react';
import { Card, CardHeader, CardContent, Grid2, Box, Typography, Chip, Divider } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { parseISO, format } from 'date-fns';

export const SubscriberConfiguration: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Card>
      <CardHeader title="Subscriber Configuration" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Subscriber ID</Typography>
              <Typography variant="body1" fontWeight={600}>{record.id}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Type</Typography>
              <Chip label={record.type} color="primary" variant="outlined" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Status</Typography>
              <Chip label={record.isActive ? 'Active' : 'Inactive'} color={record.isActive ? 'success' : 'error'} variant="outlined" />
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Endpoint</Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', backgroundColor: 'action.hover', p: 1, borderRadius: 1, fontFamily: 'monospace' }}>
                {record.endpoint || 'Not configured'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Created</Typography>
              <Typography variant="body1">{format(parseISO(record.createdAt), 'MMM dd, yyyy HH:mm')}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Last Updated</Typography>
              <Typography variant="body1">{format(parseISO(record.updatedAt), 'MMM dd, yyyy HH:mm')}</Typography>
            </Box>
          </Grid2>
        </Grid2>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>Topic Configuration</Typography>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Topic Name</Typography>
              <Typography variant="body1" fontWeight={600}>{record.topic?.name || 'Unknown Topic'}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Event Triggers</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {record.topic?.onCreate && (<Chip label="Create" size="small" color="info" variant="outlined" />)}
                {record.topic?.onUpdate && (<Chip label="Update" size="small" color="warning" variant="outlined" />)}
                {record.topic?.onDelete && (<Chip label="Delete" size="small" color="error" variant="outlined" />)}
                {!record.topic?.onCreate && !record.topic?.onUpdate && !record.topic?.onDelete && (
                  <Typography variant="body2" color="text.secondary">No event triggers configured</Typography>
                )}
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};

export default SubscriberConfiguration;


