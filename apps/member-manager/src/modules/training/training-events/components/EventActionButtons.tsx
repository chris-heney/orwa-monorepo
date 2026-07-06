import React, { useEffect, useState } from 'react'
import { UpdateParams, useDataProvider, useRecordContext, useRefresh } from 'react-admin'
import { YearMonthDay } from '../../../../helpers/Data'
import authProvider from '../../../../authProvider'
import { Box, Button, Theme, useMediaQuery } from '@mui/material'
import EmailModal from './EventModalEmailDeq'
import PostModal from './EventModalPostWebsite'
import SuccessNotification from '../../../_components/SuccessNotification'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import SendIcon from '@mui/icons-material/Send'
import CancelIcon from '@mui/icons-material/Cancel'



const EventActionButtons = () => {
  const record = useRecordContext()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [postModalIsOpen, setPostModalIsOpen] = useState(false)
  const dataProvider = useDataProvider()
  const [role, setRole] = useState('')
  const refresh = useRefresh()
  const [notification, setSendNotification] = useState(false)

  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const getRole = async () => {
    try {
      if (authProvider && authProvider.getIdentity) {
        const identity = await authProvider.getIdentity()
        if (identity) {
          setRole(identity.role)
        }
      } else {
        console.error('Identity not available')
      }
    } catch (error) {
      console.error('Error fetching identity', error)
    }
  }

  //send event for review can implement sending email to training manager
  const handlePublishClass = async () => {
    const identity = await authProvider.getIdentity?.()
    const newStatus = 'REVIEW'
    const updatedRecordParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        status: newStatus,
      },
    }

    await dataProvider.update('training-events', updatedRecordParams)



    const formattedStartDate = new Date(record.start).toLocaleDateString('en-US', YearMonthDay)
    const formattedEndDate = new Date(record.end).toLocaleDateString('en-US', YearMonthDay)

    try {
      const payload = {
        to: 'dhall@orwa.org',
        from: identity?.id,
        subject: `Review Training Event - ${record.program} ${formattedStartDate} - ${formattedEndDate}`,
        templateId: 2,
        variables: {
          event_link: `https://orwa.org/member-manager/#/training-events/${record.id}/show`,
        },
      }

      const response = await fetch(`${import.meta.env.VITE_MAILER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${identity?.token}`,
        },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        refresh()

        setSendNotification(true)
      } else {
        // Handle the case where sending the email failed
        console.error('Failed to send email')
      }
    } catch (error) {
      // Handle errors during the update or email sending process
      console.error('Failed to send email')
      console.error('Error:', error)
    }
  }


  //cancel event send email to training manager
  const cancelTraining = async () => {
    const newStatus = 'CANCELLED'
    const updatedRecordParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        status: newStatus
      }
    }
    await dataProvider.update('training-events', updatedRecordParams)
    refresh()
  }
  // they event is un cancelled
  const Reinstate = async () => {
    const newStatus = 'DRAFT'
    const updatedRecordParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        status: newStatus
      }
    }
    await dataProvider.update('training-events', updatedRecordParams)
    refresh()
  }
  useEffect(() => {
    getRole()
  }, [])

  // Roles //
  const canPostToDEQandSite = ['Training Managaer', 'Admin', 'Administrator']
  const crud = ['Training Manager', 'Office Admin', 'Executive', 'Field Staff', 'Office Admin', 'Administrator', 'Admin']
  return (
    <>
      <Box>
        {record?.status === 'DRAFT' && crud.includes(role) && (
          <Button sx={{borderRadius: 0, boxShadow: 'none', fontSize: isSmall ? 12 : 18}}  color='success' variant='contained' onClick={() => handlePublishClass()}>
            Send for Review  <UploadFileIcon sx={{ height: 18, width: 18, marginLeft: 1}} />
          </Button>
        )}

        {(record?.status === 'COMPLETE' || record?.status === 'RSVP' || record?.status === 'LIVE' && crud.includes(role)) && (
          <Button sx={{borderRadius: 0, boxShadow: 'none', fontSize: isSmall ? 12 : 18}}  color='error' variant='contained' onClick={() => cancelTraining()}>
           Cancel <CancelIcon sx={{ height: 18, width: 18, marginLeft: 1}} /> 
          </Button>
        )}
        
        {record?.status === 'CANCELLED' && crud.includes(role) && (
          <Button sx={{borderRadius: 0, boxShadow: 'none', fontSize: isSmall ? 12 : 18}}  color='success' variant='contained' onClick={() => Reinstate()}>
          Reinstate  <SendIcon sx={{ height: 18, width: 18, marginLeft: 1}} />  
          </Button>
        )}
        {record?.status === 'REVIEW' && canPostToDEQandSite.includes(role) && (
          <Button sx={{borderRadius: 0, height: '100%', boxShadow: 'none', fontSize: isSmall ? 12 : 18}} color='success' variant='contained' onClick={() => setModalIsOpen(true)}>
           Send To DEQ  <SendIcon sx={{ height: 18, width: 18, marginLeft: 1}} />
          </Button>
        )}
        {record?.status === 'DEQ' && canPostToDEQandSite.includes(role) && (
          <Button sx={{borderRadius: 0, boxShadow: 'none', fontSize: isSmall ? 12 : 18}} color='success' variant='contained' onClick={() => setPostModalIsOpen(true)}>
            Post to Site <SendIcon sx={{ height: 18, width: 18, marginLeft: 1}} /> 
          </Button>
        )}
      </Box>
      <EmailModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen} />
      <PostModal
        setPostModalIsOpen={setPostModalIsOpen}
        postModalIsOpen={postModalIsOpen} />
      <SuccessNotification duration={5000} notification={notification} text='Event Status Changed To Review - Training Manager Will be Notified' setSendNotification={setSendNotification} />

    </>
  )
}

export default EventActionButtons
