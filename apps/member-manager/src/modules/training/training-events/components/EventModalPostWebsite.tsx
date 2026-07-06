import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Form, TextInput, UpdateParams, useDataProvider, useGetList, useGetMany, useRecordContext, useRefresh } from 'react-admin'
import ModernTribeEventController from '../helpers/ModernTribeEventController'
import { SubmitHandler } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import SendIcon from '@mui/icons-material/Send'
import ClearIcon from '@mui/icons-material/Clear'
import dayjs from 'dayjs'
import { ITrainingTopic, ITrainingBlock, ITrainingSession } from '../../_types'
import RenewalAgenda from './DeqPostToWebsitePdf'


interface EventModalPostWebsiteProps {
  postModalIsOpen: boolean
  open?: boolean
  setPostModalIsOpen: (isOpen: boolean) => void
}

const EventModalPostWebsite = ({
  postModalIsOpen,
  setPostModalIsOpen,
}: EventModalPostWebsiteProps) => {
  const timeOption: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }
  const dateOption: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    hour12: true,
  }

  const [loading, setLoading] = useState(false)
  const [postError, setPostError] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const dataProvider = useDataProvider()
  const record = useRecordContext()
  const refresh = useRefresh()


  const [notifySystemOffices, setNotifySystemOffices] = useState(true)
  const [notifyOperators, setNotifyOperators] = useState(true)

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

  const {
    data: instructorOptions = [],
  } = useGetList('training-instructors', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  // attatched public notes to description will probably have 
  //to format this better with the scheduel
  const instructor = instructorOptions?.find((t) => t.id === record.instructor)

  const scheduleContent = record.public_notes + '\n' + `${schedule
    ? blocks
      ?.map((block, blockIndex) => {
        const blockDate = dayjs(record.start)
          .add(Math.floor((blockIndex - 2) / 2) + 1, 'day')
          .format('MM-DD-YYYY')

        const blockInfo = `Block ${blockIndex + 1} ${block.am_pm} ${blockDate}`

        const topicsInfo = block.training_sessions
          ?.map((sessionId: number, sessionIndex: number) => {
            const session = sessions?.find((s: ITrainingSession) => s.id === sessionId)
            const topic = topics?.find((t: ITrainingTopic) => t.id === session?.topic)

            if (session && topic) {
              return `Topic ${sessionIndex + 1} ${topic.name} ${dayjs(`1970-01-01 ${session.start}`).format(
                'h:mm'
              )} - ${dayjs(`1970-01-01 ${session.end}`).format('h:mm')} ${block.am_pm}`
            }

            return null
          })
          .filter((topic: ITrainingTopic) => topic !== null)
          .map((indentedTopic: ITrainingTopic) => `<p style="margin-left: 25px">${indentedTopic}</p>`)
          .join('\n\n')

        return `${blockInfo}\n\n${topicsInfo}`
      })
      .join('\n\n')
    : ''}`

  // const htmlSchedule = record.public_notes + '\n' + `
  // <!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <title>Schedule Table</title>
  //   <style>
  //     table {
  //       border-collapse: collapse;
  //       width: 100%;
  //     }
    
  //     th, td {
  //       border: 1px solid #dddddd;
  //       text-align: left;
  //       padding: 8px;
  //     }
    
  //     th {
  //       background-color: #f2f2f2;
  //     }
  //   </style>
  // </head>
  // <body>
    
  // <table>
  //   <thead>
  //     <tr>
  //       <th>Date</th>
  //       <th>Block Info</th>
  //       <th>Topics Info</th>
  //     </tr>
  //   </thead>
  //   <tbody>
  //     ${schedule
  //       ? blocks?.map((block, blockIndex) => {
  //         const blockDate = dayjs(/* Replace with your date logic based on block */).format('MM-DD-YYYY');
    
  //         const blockInfo = `Block ${blockIndex + 1} ${block.am_pm} ${blockDate}`;
    
  //         const topicsInfo = block.training_sessions
  //           ?.map((sessionId, sessionIndex) => {
  //             const session = sessions?.find(s => s.id === sessionId);
  //             const topic = topics?.find(t => t.id === session?.topic);
    
  //             if (session && topic) {
  //               return `<p style="margin-left: 25px">Topic ${sessionIndex + 1} ${topic.name} ${dayjs(`1970-01-01 ${session.start}`).format('h:mm')} - ${dayjs(`1970-01-01 ${session.end}`).format('h:mm')} ${block.am_pm}</p>`;
  //             }
    
  //             return null;
  //           })
  //           .filter(topic => topic !== null)
  //           .join('\n\n');
    
  //         return `
  //           <tr>
  //             <td>${blockDate}</td>
  //             <td>${blockInfo}</td>
  //             <td>${topicsInfo}</td>
  //           </tr>
  //         `;
  //       })
  //       .join('\n\n')
  //     : ''}
  //   </tbody>
  // </table>
    
  // </body>
  // </html>
  // `
  const handlePostToSite: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true)

    try {
      const startDate = new Date(record.start)
      const endDate = new Date(record.end)
      const formatedStartTime = startDate.toLocaleString('en-US', timeOption)
      const formatedEndTime = endDate.toLocaleString('en-US', timeOption)
      const formatedStartDate = startDate.toLocaleString('en-US', dateOption)
      const eventCalendarController = ModernTribeEventController.getInstance()
      await eventCalendarController.createEvent({
        title: `City: ${record.address.city} | ${record.training_type} | ${formatedStartDate} | ${formatedStartTime} - ${formatedEndTime} | Instr. ${instructor.instructor.first} ${instructor.instructor.last}`,
        page: 1,
        per_page: 10,
        start_date: record.start,
        end_date: record.end,
        starts_before: record.start,
        starts_after: record.start,
        ends_before: record.end,
        ends_after: record.end,
        strict_dates: false,
        search: record.event,
        // categories: [1, 2, 3],
        // board training 287
        // conferences 301
        //lab certification 286
        //operator certification 288
        //renewal training 289

        // tags: [4, 5, 6],
        venue: record.venue_id ? record.venue_id : {
          street: record.street,
          city: record.city,
          zip: record.zip,
          state: record.state,
        },
        // @TODO: Reverse engineer tribe endpoint to look for venue/organizaer filter
        // @TODO: Figure out a way for marcos to have the right categories/tags
        // @TODO: When sogitmebody RSVP's to a class, we need to update Member Manager with the new attendee
        // @TODO: QR Code Function
        // @TODO :  organizer: [9, 10],
        featured: true,
        status: 'draft',
        geoloc: true,
        geoloc_lat: 40.7128,
        geoloc_lng: -74.0060,
        description: scheduleContent.length > 0 ? scheduleContent : 'No Description',
        ticketed: true,
        notifySystemOffices: notifySystemOffices,
        notifyOperators: notifyOperators,
      })

      const newStatus = 'RSVP'

      const updatedRecordParams: UpdateParams = {
        id: data.id,
        previousData: record,
        data: {
          deq_class_number: data.deq_class_number,
          status: newStatus,
        },
      }

      await dataProvider.update('training-events', updatedRecordParams)

      setLoading(false)
      setPostSuccess(true)

      setTimeout(() => {
        setPostSuccess(false)
        setPostModalIsOpen(false)
        refresh()
      }, 2000)

    } catch (error) {
      setLoading(false)
      setPostError(true)
      setTimeout(() => {
        setPostError(false)
        setPostModalIsOpen(false)
      }, 2000)
    }
  }

  return (
    <Modal
      onClose={() => setPostModalIsOpen(false)}
      open={postModalIsOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        maxHeight: '60%',
        overflowY: 'scroll',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Button style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer' }} onClick={() => setPostModalIsOpen(false)}><ClearIcon /></Button>
        <Typography id="modal-modal-title" variant="h4" component="h2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Ready To Post?
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>

        </Typography>
        <Form onSubmit={handlePostToSite}>
          <TextInput source='deq_class_number' defaultValue={''} label="DEQ Class Number" placeholder="12345" fullWidth />
          <FormControlLabel
            control={
              <Checkbox
                checked={notifySystemOffices}
                onChange={() => setNotifySystemOffices(!notifySystemOffices)}
                color="primary"
              />
            }
            label="notify system member offices"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notifyOperators}
                onChange={() => setNotifyOperators(!notifyOperators)}
                color="primary"
              />
            }
            label="notify operators requesting notification"
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Button type='submit' variant="contained" color="primary">
              <SendIcon /> Post To Site
            </Button>
          )}
          {postError && (
            <Alert severity="error">Error posting class to site</Alert>
          )}
          {postSuccess && (
            <Alert severity="success">Class is posted to site!</Alert>
          )}

        </Form>
        <RenewalAgenda/>
      </Box>
    </Modal>
  )
}


export default EventModalPostWebsite
