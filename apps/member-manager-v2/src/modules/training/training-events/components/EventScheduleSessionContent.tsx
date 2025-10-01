import {Box, CardContent, Divider, Grid, IconButton, Typography} from "@mui/material"
import dayjs from 'dayjs'
import React from 'react'
import { ITrainingTopic, ITrainingBlock, ITrainingSession } from '../../_types'
import { QRFieldProps } from './ScheduleShow' 
import GroupIcon from '@mui/icons-material/Group'
import { Identifier } from 'react-admin'

interface SessionContentProps {
    QRField: React.ComponentType<QRFieldProps>
    block: ITrainingBlock
    blocks: ITrainingBlock[]
    blockIndex: number
    sessions: ITrainingSession[] | undefined 
    topics: ITrainingTopic[] | undefined
    handleQrToggle: (title: string) => void
    handleOpenModal: (info: { session: Identifier | undefined | null}, title: string) => void
  }  
const EventScheduleSessionContent = ({block ,blockIndex, blocks , sessions, topics, handleQrToggle, handleOpenModal, QRField} : SessionContentProps) => {
  return (
    <CardContent sx={{ background: '#F8F8F8' }}>
      <Grid container spacing={2}>
        {block.training_sessions?.map((sessionId, sessionIndex) => {
          const session = sessions?.find((s: ITrainingSession) => s.id === sessionId)
          if (session) {

            const topic = topics?.find((t: ITrainingTopic) => t.id === session.topic)
            return (
              <Grid item xs={12}
                sm={6}
                md={6}
                lg={6}
                key={sessionIndex}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Typography variant="body1">Session {sessionIndex + 1}</Typography>
                    <Box alignItems={'center'}>
                      <Typography variant="body1">
                        {dayjs(`1970-01-01 ${session.start}`).format('h:mm')} - {dayjs(`1970-01-01 ${session.end}`).format('h:mm')} {blocks[blockIndex].am_pm}
                      </Typography>

                    </Box>
                    <QRField handleQrToggle={() => handleQrToggle(`Check in Session ${sessionIndex +1}`)} sessionId={session.id} blockId={block.id} minutes={60} />
                  </Box>
                  {topic && (
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Typography variant="body1">Topic: {topic.name}</Typography>
                      <IconButton
                        style={{
                          padding: '2px',
                          fontSize: '8px',
                          transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.5)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                        size='small'
                        onClick={() => handleOpenModal({ session: session.id}, `Session ${sessionIndex + 1} Attendance`)}><GroupIcon /></IconButton>
                    </Box>
                  )}
                  <Divider />
                </Box>
              </Grid>
            )
          }
          return null
        })}
      </Grid>
    </CardContent>
  )
}

export default EventScheduleSessionContent
