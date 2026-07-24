import React, { useEffect, useState } from 'react'
import { useGetList, useRecordContext, Loading, useRefresh } from 'react-admin'
import EventModalTopic from './EventModalTopic'

import { ITrainingBlock } from '../../_types'
import { Alert, Box, Button, Chip, Modal, Typography } from '@mui/material'
import PublishIcon from '@mui/icons-material/Publish'
import UpdateIcon from '@mui/icons-material/Update'
import TrainingScheduleBuilder from './EventTrainingScheduleAccordion'
import SuccessNotification from '../../../_components/SuccessNotification'

import authProvider from '../../../../authProvider'

const EventPanelScheduleModify = () => {
  const trainingEvent = useRecordContext()
  const refresh = useRefresh()
  const [isTopicOpen, setIsTopicOpen] = useState(false)
  const [blocks, setBlocks] = useState<ITrainingBlock[]>([])
  const [sendNotification, setSendNotification] = useState(false)
  const [successText, setSuccessText] = useState('')

  const { data: instructorOptions = [], isLoading: isLoadingInstructors } =
    useGetList('training-instructors', {
      meta: { raw: true },
      pagination: { page: 1, perPage: 1000 },
    })

  const { data: topicOptions = [], isLoading: isLoadingTopics } = useGetList(
    'training-topics',
    {
      meta: { raw: true },
      pagination: { page: 1, perPage: 1000 },
    }
  )

  const { data: trainingSchedule = [], isLoading: isLoadingTrainingSchedule } =
    useGetList('training-schedules', {
      meta: { populate: true },
      filter: { event: trainingEvent?.id.toString() },
    })

  const turnOnSuccessNotification = (txt: string) => {
    setSuccessText(txt)
    setSendNotification(true)
  }

  const getTrainingSchedule = async () => {
    try {
      const identity = await authProvider.getIdentity?.()
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/schedule-functions/get-training-schedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${identity?.token}`,
          },
          body: JSON.stringify({ trainingSchedule: trainingSchedule }),
        }
      )

      if (response.ok) {
        const result = await response.json()
        setBlocks(result.data)
      } else {
        console.error('Failed to load Training Schedule:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading training schedule:', error)
    }
  }

  const updateTrainingSchedule = async () => {
    const identity = await authProvider.getIdentity?.()
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/schedule-functions/update-training-schedule`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${identity?.token}`,
        },
        body: JSON.stringify({
          blocks: blocks,
          trainingEvent: trainingEvent,
          trainingSchedule: trainingSchedule,
        }),
      }
    )
    if (response.ok) {
      const result = await response.json()
      if (result === true) {
        turnOnSuccessNotification('Training schedule updated.')
      }
    } else {
      console.error('Update failed:', response.statusText)
    }
  }

  const submitTrainingSchedule = async () => {
    const identity = await authProvider.getIdentity?.()
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/schedule-functions/submit-training-schedule`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${identity?.token}`,
        },
        body: JSON.stringify({
          trainingScheduleBlocks: blocks,
          eventId: trainingEvent.id,
        }),
      }
    )

    if (response.ok) {
      await response.json()
      turnOnSuccessNotification('Training schedule created.')
      refresh()
    } else {
      console.error('Update failed:', response.statusText)
    }
  }

  useEffect(() => {
    if (trainingSchedule.length > 0) {
      getTrainingSchedule()
    }
  }, [trainingSchedule])

  const scheduledHours = blocks.reduce(
    (sum, block) =>
      sum + block.sessions.reduce((s, session) => s + (session.topic?.hours ?? 0), 0),
    0
  )
  const eventHours: number | null = trainingEvent?.hours ?? null
  const hoursMismatch = eventHours != null && scheduledHours !== eventHours

  const saveButton =
    trainingSchedule.length > 0 ? (
      <Button
        onClick={updateTrainingSchedule}
        variant="contained"
        color="success"
        endIcon={<UpdateIcon />}
        sx={{ boxShadow: 'none', whiteSpace: 'nowrap' }}
      >
        Update Schedule
      </Button>
    ) : (
      <Button
        onClick={submitTrainingSchedule}
        endIcon={<PublishIcon />}
        color="success"
        sx={{
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          '&.Mui-disabled': {
            color: 'rgba(255,255,255,0.45)',
            backgroundColor: 'rgba(255,255,255,0.14)',
          },
        }}
        variant="contained"
        disabled={blocks.length === 0}
      >
        Add Schedule to Event
      </Button>
    )

  if (isLoadingInstructors || isLoadingTopics || isLoadingTrainingSchedule) {
    return <Loading />
  }

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 48,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          backgroundColor: '#262626',
          px: 1.5,
          py: 0.75,
          minHeight: 48,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontSize: '1rem',
            }}
          >
            Training Schedule
          </Typography>
          <Chip
            size="small"
            label={`${scheduledHours} / ${eventHours ?? '—'} credit hrs`}
            sx={{
              color: 'white',
              backgroundColor: hoursMismatch
                ? 'rgba(255,152,0,0.35)'
                : 'rgba(76,175,80,0.35)',
              fontWeight: 600,
            }}
          />
        </Box>
        {saveButton}
      </Box>

      {hoursMismatch && blocks.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Scheduled topic credit hours ({scheduledHours}) don&apos;t match the
          event&apos;s hours ({eventHours}).
        </Alert>
      )}

      <TrainingScheduleBuilder
        updateTrainingSchedule={updateTrainingSchedule}
        setIsTopicOpen={setIsTopicOpen}
        instructorOptions={instructorOptions}
        topicOptions={topicOptions}
        blocks={blocks}
        setBlocks={setBlocks}
      />

      <SuccessNotification
        setSendNotification={setSendNotification}
        notification={sendNotification}
        text={successText}
      />

      <Modal
        open={isTopicOpen}
        onClose={() => setIsTopicOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* EventModalTopic must be wrapped so Modal can attach its ref */}
        <>
          <EventModalTopic setIsModalOpen={setIsTopicOpen} />
        </>
      </Modal>
    </>
  )
}

export default EventPanelScheduleModify
