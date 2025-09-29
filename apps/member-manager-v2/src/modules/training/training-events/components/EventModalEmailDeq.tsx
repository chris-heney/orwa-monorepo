import { Box, Button, Modal, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { AuthProvider, UpdateParams, useAuthProvider, useDataProvider, useGetList, useGetMany, useRecordContext, useRefresh } from 'react-admin'
import EmailSendForm from './EventModalEmailDeqForm'
import { ITrainingTopic, ITrainingBlock, ITrainingSession } from '../../_types'
import dayjs from 'dayjs'
import SendIcon from '@mui/icons-material/Send'
import SuccessNotification from '../../../_components/SuccessNotification'
import EventExportDeq from './EventExportDeq'
import { saveAs } from 'file-saver'
// import { pdf } from '@react-pdf/renderer'
import MyDocument from './PdfDeqDocument'
interface EmailProps {
  modalIsOpen: boolean
  open?: boolean
  setModalIsOpen: (isOpen: boolean) => void
}

const EventModalEmailDeq: React.FC<EmailProps> = ({
  modalIsOpen,
  setModalIsOpen,
}) => {


  const [loading, setLoading] = useState(false)
  const [viewingEmail, setViewingEmail] = useState(false)
  const record = useRecordContext()
  const authProvider = useAuthProvider() as AuthProvider
  const dataProvider = useDataProvider()
  const refresh = useRefresh()

  const [sendNotification, setSendNotification] = useState(false)
  const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error' | undefined>('success')

  const [toValue, setToValue] = useState('training@orwa.org')
  const [subjectValue, setSubjectValue] = useState('DEQ Class Number Request')

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

  const handleSendToDeq = async () => {
    const identity = await authProvider.getIdentity?.()
    if (!identity) {
      setLoading(false)
      return
    }
    setLoading(true)

    const scheduleContent = `${schedule
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




    const payload = {
      // to: toValue,  // dhall@orwa.org
      to: 'Chris.heney@gmail.com',
      from: identity.id, //current users email
      subject: 'DEQ Class Number Request',
      templateId: 3,
      variables: {
        sender: 'Doug Hall',
        recipient_name: 'DEQ',
        class_name: record.class_name,
        training_type: record.training_type,
        program: record.program,
        location: record.location,
        hours: record.hours,
        start: record.start,
        end: record.end,
        full_schedule: scheduleContent,
        address: record.address.street + ', ' + record.address.state + ', ' + record.address.zip,
        class_notes: record.public_notes,
      },
    }

  

    try {
      const response = await fetch(import.meta.env.VITE_MAILER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${identity.token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const newStatus = 'DEQ'
        const updatedRecordParams: UpdateParams = {
          id: record.id,
          previousData: record,
          data: {
            status: newStatus
          }
        }

        await dataProvider.update('training-events', updatedRecordParams)
        setSendNotification(true)
        setSeverity('success')
        setLoading(false)
        setTimeout(() => {
          setModalIsOpen(false)
          setViewingEmail(false)
          refresh()
        }, 1000)
      } else {

        const updatedRecordParams: UpdateParams = {
          id: record.id,
          previousData: record,
          data: {
            status:  'DEQ'
          }
        }

        await dataProvider.update('training-events', updatedRecordParams)
        setTimeout(() => {
          setSendNotification(true)
          setSeverity('error')
          setLoading(false)
          setModalIsOpen(false)
        }, 1000)

      }
    } catch (error) {
      console.log(error)
    }
  }


  const downloadPdf = async () => {
    try {
      const fileName = 'test.pdf'
      const pdfBlob = await pdf(<MyDocument/>).toBlob()
      
  
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }


  return (
    <>
      <Modal
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false)
          setViewingEmail(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: viewingEmail ? '70%' : '400px',
          maxHeight: '600px',
          overflowY: 'scroll',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Button onClick={downloadPdf}>Download PDF</Button>
          <Button style={{ position: 'absolute', top: '10px', left: '10px', border: 'none', cursor: 'pointer', }} onClick={() => viewingEmail ? setViewingEmail(false) : setViewingEmail(true)} >{viewingEmail ? 'Return' : 'View Email'}</Button>
          {loading ? <CircularProgress sx={{ position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer' }} /> :
            <Button
              variant='contained'
              color='success'
              sx={{ position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer' }}
              onClick={() => handleSendToDeq()}
            >
              <SendIcon sx={{ mr: 1 }} />Send To DEQ
            </Button>}
          {viewingEmail ? (
            // <EmailContent />
            <EventExportDeq />
          ) : (
            <EmailSendForm
              handleSendToDeq={handleSendToDeq}
              toValue={toValue}
              setToValue={setToValue}
              subjectValue={subjectValue}
              loading={loading}
              setSubjectValue={setSubjectValue}
            />
          )}
        </Box>
      </Modal >
      <SuccessNotification
        setSendNotification={setSendNotification}
        notification={sendNotification}
        duration={5000}
        text={severity === 'error' ? 'Failed to send Email Sent To DEQ' : 'Email Sent To DEQ'}
        severity={severity}
      />
    </>
  )
}


export default EventModalEmailDeq
