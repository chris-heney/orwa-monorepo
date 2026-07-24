import { Box, CardContent, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { ITrainingBlock } from '../../_types'
import { QRFieldProps } from './ScheduleShow'
import GroupIcon from '@mui/icons-material/Group'
import { RaRecord } from 'react-admin'

interface BlockContentProps {
    QRField: React.ComponentType<QRFieldProps>
    block: ITrainingBlock
    blockIndex: number
    handleQrToggle: (title: string) => void
    record: RaRecord
    handleOpenModal: (info: { block: number | undefined}, title: string) => void
  }  
const  EventScheduleBlockContent = ({record, block ,blockIndex, handleQrToggle, handleOpenModal, QRField} : BlockContentProps) => {
  return (
    <CardContent sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.selected' : '#F3F2F2' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6">  {`${block.am_pm} ${dayjs(record.start).add(Math.floor((blockIndex - 2) / 2) + 1, 'day').format('MM-DD-YYYY')}`}</Typography>
        </Box>
        <Box display={'flex'} alignItems={'center'}>
          <Typography variant="h6" mr={2}>
          Block {blockIndex + 1}
          </Typography>
          <QRField handleQrToggle={() => handleQrToggle(`Check in Block ${blockIndex +1}`)} blockId={block.id} minutes={240} />
          <IconButton
            style={{
              transition: 'transform 0.2s',
              padding: '2px',
              fontSize: '8px',
              marginLeft: 10
            }}
            size='small'
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.5)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
            onClick={() => handleOpenModal({ block: block.id }, `Block ${blockIndex + 1} Attendance`)}><GroupIcon /></IconButton>
        </Box>
      </Box>
    </CardContent>
  )
}

export default EventScheduleBlockContent
