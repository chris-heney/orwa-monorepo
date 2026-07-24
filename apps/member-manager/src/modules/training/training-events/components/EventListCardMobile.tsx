import React from 'react'
import { Avatar, Box, Card, IconButton, Tooltip, Typography } from '@mui/material'
import { useGetOne, useRecordContext } from 'react-admin'
import TrainingClassActionsButton from './EventListActionsPopUp'
import { YearMonthDay } from '../../../../helpers/Data'
import DirectionsIcon from '@mui/icons-material/Directions'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TrainingStatusChip from '../../_components/TrainingStatusChip'

const EventListCardMobile = () => {
  const record = useRecordContext()

  const formattedStartDate = new Date(record.start).toLocaleString('en-US', YearMonthDay)
  const formattedEndDate = new Date(record.end).toLocaleString('en-US', YearMonthDay)

  // Single cached lookup per instructor (react-query dedupes across cards)
  const { data: instructorRecord } = useGetOne(
    'training-instructors',
    { id: record.instructor },
    { enabled: record.instructor != null }
  )
  const contact = instructorRecord?.instructor
  const contactName =
    contact && typeof contact === 'object'
      ? `${contact.first ?? ''} ${contact.last ?? ''}`.trim()
      : null

  const mapsHref = record.address
    ? `https://maps.google.com/?q=${encodeURIComponent(
        `${record.address.street ?? ''}, ${record.address.city ?? ''}, ${record.address.state ?? ''} ${record.address.zip ?? ''}`
      )}`
    : null

  return (
    <Card
      sx={{
        width: '100%',
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrainingStatusChip status={record.status} />
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          noWrap
          sx={{ flexGrow: 1, minWidth: 0 }}
        >
          {record.training_type}
        </Typography>
        <TrainingClassActionsButton />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
        <CalendarMonthIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2">
          {formattedStartDate} – {formattedEndDate}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        {contactName ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Avatar
              src={contact?.avatar?.[0]?.url}
              sx={{ width: 28, height: 28, fontSize: '0.8rem' }}
            >
              {contactName.charAt(0)}
            </Avatar>
            <Typography variant="body2" noWrap>
              {contactName}
            </Typography>
          </Box>
        ) : (
          <Box />
        )}
        {mapsHref && (
          <Tooltip title="Directions">
            <IconButton
              size="small"
              color="primary"
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DirectionsIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Card>
  )
}

export default EventListCardMobile
