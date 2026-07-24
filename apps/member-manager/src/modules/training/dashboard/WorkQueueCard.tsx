import React, { ReactNode } from 'react'
import {
  Box,
  Button,
  Card,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material'
import { RaRecord, useGetList } from 'react-admin'
import { Link } from 'react-router-dom'
import { YearMonthDay } from '../../../helpers/Data'
import TrainingStatusChip from '../_components/TrainingStatusChip'

type WorkQueueCardProps = {
  title: string
  icon: ReactNode
  filter: Record<string, unknown>
  emptyText: string
  actionLabel: string
  /** Optional secondary line under the event type */
  secondary?: (record: RaRecord) => string | null
}

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', YearMonthDay)

/**
 * A "what needs doing" panel: server-filtered slice of training events with
 * one primary action per row (opens the event's show page pipeline header).
 */
const WorkQueueCard = ({
  title,
  icon,
  filter,
  emptyText,
  actionLabel,
  secondary,
}: WorkQueueCardProps) => {
  const { data, total, isLoading } = useGetList('training-events', {
    pagination: { page: 1, perPage: 6 },
    sort: { field: 'start', order: 'ASC' },
    filter,
  })

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25 }}>
        {icon}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {!isLoading && total != null && total > 0 && (
          <Typography variant="caption" color="text.secondary">
            {total} total
          </Typography>
        )}
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {isLoading && (
          <Box sx={{ p: 2 }}>
            <Skeleton height={28} />
            <Skeleton height={28} />
            <Skeleton height={28} />
          </Box>
        )}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: 'center' }}
          >
            {emptyText}
          </Typography>
        )}
        {!isLoading &&
          data?.map((record) => {
            const secondaryText = secondary?.(record) ?? null
            return (
              <Box
                key={record.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {record.training_type}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {fmt(record.start)} – {fmt(record.end)}
                    {secondaryText ? ` · ${secondaryText}` : ''}
                  </Typography>
                </Box>
                <TrainingStatusChip status={record.status} />
                <Button
                  component={Link}
                  to={`/training-events/${record.id}/show`}
                  size="small"
                  variant="outlined"
                  sx={{ flexShrink: 0 }}
                >
                  {actionLabel}
                </Button>
              </Box>
            )
          })}
      </Box>
    </Card>
  )
}

export default WorkQueueCard
