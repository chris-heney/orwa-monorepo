import React, { useState } from 'react'
import {
  useGetList,
  useGetMany,
  useRecordContext,
  RaRecord,
  Identifier
} from 'react-admin'
import {
  Grid,
  Card,
  Divider,
  Button,
  Modal,
  Box,
  Typography,
} from '@mui/material'
import QRCode from 'react-qr-code'
import { ITrainingTopic, ITrainingBlock } from '../../_types'
import * as saveSvgAsPng from 'save-svg-as-png'
import { Margin, Resolution, usePDF } from 'react-to-pdf'
import DownloadIcon from '@mui/icons-material/Download'
import ModalQrCode from './ModalQrCode' 
import { YearMonthDayMinute } from '../../../../helpers/Data'
import ModalEventAttendance from './ModalEventAttendance'
import EventScheduleSessionContent from './EventScheduleSessionContent' 
import EventScheduleBlockContent from './EventScheduleBlockConent'
import EventScheduleHeader from './EventScheduleHeader' 


export interface QRFieldProps {
  blockId?: Identifier
  sessionId?: Identifier | null
  minutes?: number
  handleQrToggle?: () => void
  size?: number | string
  trainsitions?: boolean
  download?: boolean
  border?: boolean
  qrTitles?: string
}
interface scheduleProps {
  button?: boolean
}

const QRField: React.FC<QRFieldProps> = ({ blockId, sessionId, minutes, handleQrToggle, size = 24, trainsitions = true, download = false, border = false }) => {
  const record = useRecordContext()

  let url = `https://orwa.org/member-dashboard/log-training/?auth_id=1&event=${record.id}&location=${record.location}&training_minutes=${minutes}`

  // Add blockId to the URL if provided
  if (blockId) {
    url += `&block=${blockId}`
  }

  // Add sessionId to the URL if provided
  if (sessionId) {
    url += `&session=${sessionId}`
  }

  const handleDownload = () => {
    handleQrToggle()
    const svgElement = document.getElementById('qr-code-svg')
    if (svgElement && download) {
      saveSvgAsPng(svgElement, 'qrcode.png', { scale: 6 })
    }
  }

  return (
    <>
      <QRCode
        onClick={() => handleDownload()}
        style={{
          cursor: 'pointer',
          transition: trainsitions ? 'transform 0.2s, box-shadow 0.2s' : '',
          border: border ? '2px solid black' : ''
        }}
        id="qr-code-svg"
        size={size}
        value={record && url}
        viewBox={'0 0 256 256'}
        onMouseOver={(e) => {
          trainsitions ? e.currentTarget.style.transform = 'scale(1.5)' : ''
        }}
        onMouseOut={(e) => {
          trainsitions ? e.currentTarget.style.transform = 'scale(1)' : ''
        }}
      />
    </>
  )
}

const Schedule: React.FC<scheduleProps> = ({ button = true }) => {
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false)
  const { toPDF, targetRef } = usePDF({ filename: 'Training-Log-Certificate.pdf', resolution: Resolution.HIGH, page: { margin: Margin.SMALL } })
  const [openModal, setOpenModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('Event Attendance')
  const [qrTitle, setQrTitle] = useState('Event Check In')
  const [selectedInfo, setSelectedInfo] = useState<{ block?: Identifier | Identifier[], session?: Identifier | Identifier[] }>({})
  const record = useRecordContext()
  const { data: schedule } = useGetList('training-schedules', {
    meta: {
      populate: true
    },
    filter: { event: record.id.toString() }
  })
  const handleQrToggle = (title?: string) => {
    if (title) {
      setQrTitle(title)
    }
    setIsQrCodeOpen(true)
  }
  const handleQrClose = () => {
    setIsQrCodeOpen(false)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleOpenModal = (info: { block?: Identifier | Identifier[]; session?: Identifier | Identifier[], }, title?: string) => {

    if (title) {
      setModalTitle(title)
    }
    setOpenModal(true)
    setSelectedInfo(info)
  }
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

  function formatDateTime(record: RaRecord): string {
    const submittion = new Date(record.publishedAt)
    return submittion.toLocaleString('en-US', YearMonthDayMinute)
  }
  return (

    <>

      {button && schedule && schedule.length > 0 && <Button sx={{
        backgroundColor: '#262626',
        color: 'white',
        borderRadius: '0px',
        '&:hover': {
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#F3F2F2',
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'white' : 'black',
        },
      }} size='small' variant="contained" onClick={() => toPDF()}>
        <DownloadIcon />
        Download
      </Button>}

      <Box ref={targetRef}>
        {schedule && schedule.length > 0
          ? (
            <EventScheduleHeader
              onClick={() => handleOpenModal({ block: blockIds, session: sessionIds }, 'Event Attendance')}
              button
              title={'Event Schedule'}
              sx={{ textAlign: 'center' }}
            />
          )
          : (
            <Typography variant={'h3'} sx={{ textAlign: 'center' }}>
              Event Schedule Empty
            </Typography>
          )
        }



        <Grid container spacing={2}>
          {blocks?.map((block, blockIndex) => {
            return (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key={blockIndex}
              >
                <Card sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                  <EventScheduleBlockContent
                    qrTitle={qrTitle}
                    handleOpenModal={handleOpenModal}
                    QRField={QRField}
                    handleQrToggle={handleQrToggle}
                    block={block}
                    blockIndex={blockIndex}
                    record={record}
                  />

                  <Divider />
                  <EventScheduleSessionContent
                    handleOpenModal={handleOpenModal}
                    blockIndex={blockIndex}
                    blocks={blocks}
                    QRField={QRField}
                    handleQrToggle={handleQrToggle}
                    topics={topics}
                    sessions={sessions}
                    block={block} />
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <ModalEventAttendance
          record={record} modalTitle={modalTitle}
          setOpenModal={setOpenModal}
          openModal={openModal}
          selectedInfo={selectedInfo}
          formatDateTime={formatDateTime} />
      </Modal>
      <Modal
        open={isQrCodeOpen}
        onClose={handleQrClose}
        closeAfterTransition
      >
        <ModalQrCode
          QRFieldComponent={QRField}
          isQrCodeOpen={isQrCodeOpen}
          handleQrClose={handleQrClose}
          handleQrToggle={handleQrToggle}
          qrTitle={qrTitle} />
      </Modal>
    </>
  )
}

export default Schedule
