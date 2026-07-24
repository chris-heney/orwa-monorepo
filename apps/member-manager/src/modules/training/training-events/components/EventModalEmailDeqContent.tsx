import { Box, Typography } from '@mui/material'
import React from 'react'
import { useGetList, useGetMany, useRecordContext } from 'react-admin'
import { ITrainingTopic, ITrainingBlock, ITrainingSession } from '../../_types'
import dayjs from 'dayjs'

const ModalEmailContent = () => {
  const record = useRecordContext()

  const { data: schedule } = useGetList('training-schedules', {
    filter: { event: record.id.toString() }
  })

  const blockIds = schedule?.map((scheduleItem) => scheduleItem.training_schedule_blocks.map((block: ITrainingBlock) => block)).flat()

  const { data: blocks } = useGetMany('training-schedule-blocks', {
    ids: blockIds,
  })

  const sessionIds = blocks?.map((blockItem) => blockItem.training_sessions.map((topic: ITrainingTopic) => topic)).flat()

  const { data: sessions } = useGetMany('training-sessions', {
    ids: sessionIds,
  })

  const topicIds = sessions?.map((sessionItem) => sessionItem.topic)

  const { data: topics } = useGetMany('training-topics', {
    ids: topicIds,
  })

  const headerStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
  }

  const signatureStyle: React.CSSProperties = {
    marginTop: '20px',
    fontWeight: 'bold',
  }

  return (
    <>
      <Typography
        id="modal-modal-title"
        variant="h4"
        component="h2"
        style={{ textAlign: 'center', fontWeight: 'bold' }}
      >
        Send to DEQ
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <>
          <Box
            sx={{
              fontFamily: 'Arial, sans-serif',
              minWidth: '60%',
              margin: '0 auto',
              padding: '20px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? theme.palette.background.default : '#FBFBFB',
            }}
          >
            <Box style={headerStyle}>
              Dear DEQ,
            </Box>
            <Box>
              I hope this message finds you well. I am writing to request a class number from the Department of Environmental Quality (DEQ) for our upcoming educational program.
              Let me provide you with the specific details of the program:
              <Typography mt={2}>
                As we progress with our project/initiative, we have reached a point where obtaining a class number from DEQ would greatly assist us in ensuring compliance and alignment with relevant regulations and guidelines.
              </Typography>
              <Box mb={2}>
                <Typography mt={2}>
                  <strong>Details of the class or program:</strong>
                </Typography>
                Type: {record.training_type}
                Topic: {record.program}
              </Box>
              {schedule ? (
                <>
                  {blocks?.map((block, blockIndex: number) => (
                    <Box key={blockIndex}>
                      <Typography>{`Block ${blockIndex + 1} ${block.am_pm} ${dayjs(record.start).add(Math.floor((blockIndex - 2) / 2) + 1, 'day').format('MM-DD-YYYY')}`}</Typography>
                      {block.training_sessions?.map((sessionId: number, sessionIndex: number) => {
                        const session = sessions?.find((s: ITrainingSession) => s.id === sessionId)
                        const topic = topics?.find((t: ITrainingTopic) => t.id === session.topic)
                        return session ? (
                          <Typography ml={2} key={sessionIndex}>{`Topic ${sessionIndex + 1}`} {topic.name} {dayjs(`1970-01-01 ${session.start}`).format('h:mm')} - {dayjs(`1970-01-01 ${session.end}`).format('h:mm')} {blocks[blockIndex].am_pm}
                          </Typography>
                        ) : null
                      })}
                    </Box>
                  ))}
                </>
              ) : (
                <></>
              )}
              <Typography mt={2} fontWeight={'bold'}>
                Location Code: {record.location}
              </Typography>
              <Typography fontWeight={'bold'}>
                Address: {record.address.street + ', ' + record.address.state + ', ' + record.address.zip}
              </Typography>
              <Typography>
                We believe that a DEQ-assigned class number will streamline the process and contribute to the success of our initiative. It will also allow us to maintain transparency and accountability in our operations.
              </Typography>
              <Typography>
                If there are any specific forms or documentation required to process this request, please do not hesitate to let us know. We are committed to providing all necessary information and complying with DEQs requirements.
              </Typography>
              <Typography>
                We kindly request your assistance in expediting this request, as our timeline for [mention the specific project or purpose] is [mention the deadline or timeframe]. Your prompt attention to this matter would be greatly appreciated.
              </Typography>
              <Typography>
                Please feel free to contact me for any further information or clarification. We look forward to a positive response.
              </Typography>
              <Box style={signatureStyle}>
                <Typography style={signatureStyle}>
                  Thank you for your time and consideration.
                </Typography>
                <Typography>
                  Sincerely,
                </Typography>
                <Typography>
                 Doug Hall
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      </Typography>
    </>
  )
}


export default ModalEmailContent
