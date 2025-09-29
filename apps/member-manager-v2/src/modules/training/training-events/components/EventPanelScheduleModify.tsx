import React, { useEffect, useState } from 'react'
import { useGetList, useRecordContext, Loading, useRefresh } from 'react-admin'
import EventModalTopic from './EventModalTopic'

import { ITrainingBlock } from '../../_types'
import { Box, Button, Divider, Modal } from '@mui/material'
import PublishIcon from '@mui/icons-material/Publish'
import UpdateIcon from '@mui/icons-material/Update'
import TrainingScheduleAccordion from './EventTrainingScheduleAccordion'
import SuccessNotification from '../../../_components/SuccessNotification'
import TrainingScheduleEditHeader from './EventScheduleEditHeader'

import authProvider from '../../../../authProvider'


const EventPanelScheduleModify = () => {

  const trainingEvent = useRecordContext()
  const refresh = useRefresh()
  const [isTopicOpen, setIsTopicOpen] = useState(false)
  const [blocks, setBlocks] = useState<ITrainingBlock[]>([])
  const [sendNotification, setSendNotification] = useState(false)
  const [successText, setSuccessText] = useState('')

  const {
    data: instructorOptions = [],
    isLoading: isLoadingInstructors
  } = useGetList('training-instructors', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  const {
    data: topicOptions = [],
    isLoading: isLoadingTopics
  } = useGetList('training-topics', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  const {
    data: trainingSchedule = [],
    isLoading: isLoadingTrainingSchedule
  } = useGetList('training-schedules', {
    meta: {
      populate: true
    },
    filter: { event: trainingEvent?.id.toString() }
  })

  const turnOnSuccessNotification = (txt: string) => {
    setSuccessText(txt)
    setSendNotification(true)
  }

  const getTrainingSchedule = async () => {
    try {
      const identity = await authProvider.getIdentity?.()
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/schedule-functions/get-training-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${identity?.token}`,
        },
        body: JSON.stringify({
          trainingSchedule: trainingSchedule,
        }),
      })
  
      if (response.ok) {
        const result = await response.json()
        setBlocks(result.data)
        turnOnSuccessNotification('Training Schedule Was Successfully Loaded')
      } else {
        console.error('Failed to load Training Schedule:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading training schedule:', error)
    }
  }

  const updateTrainingSchedule = async () => {

    const identity = await authProvider.getIdentity?.()

    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/schedule-functions/update-training-schedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${identity?.token}`,
      },
      body: JSON.stringify({
        blocks: blocks,
        trainingEvent: trainingEvent,
        trainingSchedule: trainingSchedule
      }),
    })
    if (response.ok === true) {
      const result = await response.json() 
      result === true ?  turnOnSuccessNotification('Training Schedule Was Successfully Updated') : false
    } else {
      console.error('Update failed:', response.statusText)
    }
  }
  const submitTrainingSchedule = async () => {

    const identity = await authProvider.getIdentity?.()
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/schedule-functions/submit-training-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${identity?.token}`,
      },
      body: JSON.stringify({
        trainingScheduleBlocks: blocks,
        eventId: trainingEvent.id
      }),
    })

    if (response.ok) {
      const result = await response.json()
      turnOnSuccessNotification('Training Schedule Was Successfully Created')
      refresh()
    } else {
      console.error('Update failed:', response.statusText)
    }
  }

  useEffect(() => {
    if (trainingSchedule.length > 0) {
      setTimeout(() => {
        getTrainingSchedule()
      }, 500)
    }
  }, [trainingSchedule])


  return (isLoadingInstructors || isLoadingTopics || isLoadingTrainingSchedule) ? <Loading /> : (
    <>
      <Box display={'flex'} alignItems={'center'}>
        <TrainingScheduleEditHeader button={trainingSchedule?.length > 0 ? (
          <>
            <Button
              onClick={() => updateTrainingSchedule()}
              variant='contained'
              color='success'
              endIcon={<UpdateIcon />}
              sx={{ borderRadius: 0, boxShadow: 'none' }}
            >
              Update Training Schedule
            </Button>
          </>
        ) : (
          <Button
            onClick={() => submitTrainingSchedule()}
            endIcon={<PublishIcon />}
            color='success'
            sx={{ borderRadius: 0, boxShadow: 'none' }}
            variant='contained'>
            Add Schedule to Event</Button>
        )
        } title='Training Schedule' />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <TrainingScheduleAccordion
        updateTrainingSchedule={updateTrainingSchedule}
        setIsTopicOpen={setIsTopicOpen}
        instructorOptions={instructorOptions}
        topicOptions={topicOptions}
        blocks={blocks}
        setBlocks={setBlocks} />

      <SuccessNotification setSendNotification={setSendNotification} notification={sendNotification} text={successText} />

      <Modal
        open={isTopicOpen}
        onClose={() => setIsTopicOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* @TODO: Cleanup: Figure out how to incorporate ref to TopicModal so we don't have to wrap it in a fragment */}
        <><EventModalTopic setIsModalOpen={setIsTopicOpen} /></>
      </Modal>
    </>
  )
}


export default EventPanelScheduleModify
