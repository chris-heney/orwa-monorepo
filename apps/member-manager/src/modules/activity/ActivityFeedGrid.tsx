import React from 'react';
import { Box } from '@mui/material';
import {
  Loading,
  OptionalRecordContextProvider,
  useListContext,
} from 'react-admin';
import ActivityItem from './ActivityItem';

const ActivityListCardGrid = () => {
  const { data, isLoading } = useListContext();

  return isLoading ? (
    <Loading />
  ) : (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
      }}
    >
      {/* data is undefined when the list fetch fails (e.g. a role without
          activity-relation read gets a 403) — fall back to the empty state. */}
      {(data ?? []).map((record) => (
        <OptionalRecordContextProvider
          value={record}
          key={`activity-${record.id}`}
        >
          <ActivityItem />
        </OptionalRecordContextProvider>
      ))}
    </Box>
  );
};

export default ActivityListCardGrid;
