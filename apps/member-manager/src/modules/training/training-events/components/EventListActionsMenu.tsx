import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { CloneButton, DeleteButton, useDataProvider, UpdateParams, useRecordContext, useRefresh, MenuItemLink } from 'react-admin'
import SendIcon from '@mui/icons-material/Send'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CancelIcon from '@mui/icons-material/Cancel'
import authProvider from '../../../../authProvider'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { YearMonthDay } from '../../../../helpers/Data'
import SuccessNotification from '../../../_components/SuccessNotification'
import { Box } from '@mui/material'


interface ActionsMenuProps {
  anchorEl: HTMLElement | null
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  open: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  setPostModalIsOpen: (isOpen: boolean) => void
}


const EventListActionsMenu: React.FC<ActionsMenuProps> = ({
  anchorEl,
  open,
  setAnchorEl,
  setModalIsOpen,
  setPostModalIsOpen,
}) => {
  const record = useRecordContext()
  const dataProvider = useDataProvider()
  const [role, setRole] = useState('')
  const [notification, setSendNotification] = useState(false)
  // Grab users role
  const refresh = useRefresh()
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
        to: 'marcosje2005@gmail.com',
        // to: 'dhall@owra.org',
        from: identity?.id,
        subject: `Review Training Event - ${record.program} ${formattedStartDate} - ${formattedEndDate}`,
        templateId: 4,
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
    handleClose()
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
    handleClose()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    getRole()
  }, [])

  // Roles //
  const canPostToDEQandSite = ['Training Managaer', 'Admin', 'Administrator']
  const crud = ['Training Manager', 'Office Admin', 'Executive', 'Field Staff', 'Office Admin', 'Administrator', 'Admin']

  return (
    <>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}

      >
        <MenuItemLink
          to={`/training-events/${record.id}/show`}
          onClick={handleClose}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#1976d2',
            fontWeight: 400,
            minWidth: 64,
            fontSize: '8.rem'
          }}>
            <VisibilityIcon sx={{ height: 18, width: 18, marginRight: .7 }} />View Event
          </Box>
        </MenuItemLink>
        {crud.includes(role) && <MenuItemLink
          to={`/training-events/${record.id}/edit`}
          onClick={handleClose}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#1976d2',
            fontWeight: 400,
            minWidth: 64,
            fontSize: '8.rem'
          }}>
            <EditIcon sx={{ height: 18, width: 18, marginRight: .7 }} />Edit Event
          </Box>
        </MenuItemLink>}
        <MenuItem onClick={handleClose}>
          {crud.includes(role) && <DeleteButton size='small' sx={{ justifyContent: 'flex-start' }} fullWidth label='Delete event' />}
        </MenuItem>

        {role === 'Admin' && <MenuItem>
          <CloneButton
            sx={{ justifyContent: 'flex-start' }}
            label="Duplicate Event"
            fullWidth
            record={{
              ...record,
              address: {
                id: null,
                street: record.address.street,
                city: record.address.city,
                state: record.address.state,
                zip: record.address.zip,
              },
              schedule: record.schedule,
              status: 'DRAFT',
              deq_class_number: null
            }}
          />
        </MenuItem>}
        {record.status === 'CANCELLED' && crud.includes(role) && (
          <MenuItem >
            <Button color='success' onClick={Reinstate} sx={{ justifyContent: 'flex-start' }} fullWidth>
              <SendIcon sx={{ height: 18, width: 18, marginRight: .7, marginLeft: -.3 }} />Reinstate
            </Button>
          </MenuItem>
        )}
        {record.status !== 'CANCELLED' && crud.includes(role) && (
          <MenuItem onClick={cancelTraining}>
            <Button fullWidth>
              <CancelIcon sx={{ height: 18, width: 18, marginRight: .7, marginLeft: -.3 }} />Cancel Training
            </Button>
          </MenuItem>
        )}
        {record.status == 'REVIEW' && canPostToDEQandSite.includes(role) && (
          <MenuItem
            onClick={() => {
              setModalIsOpen(true)
            }}
          >
            <Button color='success' sx={{ justifyContent: 'flex-start' }} startIcon={<SendIcon sx={{ height: 18, width: 18 }} />} fullWidth>
              Send to DEQ
            </Button>
          </MenuItem>
        )}

        {record.status == 'DRAFT' && crud.includes(role) && (
          <MenuItem onClick={handlePublishClass}>
            <Button color='success' sx={{ justifyContent: 'flex-start' }} fullWidth>
              <UploadFileIcon sx={{ height: 18, width: 18, marginRight: .7, marginLeft: -.7 }} />Send For Review
            </Button>
          </MenuItem>
        )}
        {record.status == 'DEQ' && canPostToDEQandSite.includes(role) && (
          <MenuItem
            onClick={() => {
              setPostModalIsOpen(true)
            }}
          >
            <Button color='success' sx={{ justifyContent: 'flex-start' }} fullWidth>
              <SendIcon sx={{ height: 18, width: 18, marginRight: .8, marginLeft: -.3 }} />Post To Site
            </Button>
          </MenuItem>
        )}
      </Menu>
      <SuccessNotification duration={5000} notification={notification} text='Event Status Changed To Review - Training Manager Will be Notified' setSendNotification={setSendNotification} />
    </>
  )
}
export default EventListActionsMenu
