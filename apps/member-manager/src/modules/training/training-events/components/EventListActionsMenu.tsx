import React, { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import {
  CloneButton,
  DeleteButton,
  useDataProvider,
  UpdateParams,
  useRecordContext,
  useRefresh,
  MenuItemLink,
} from 'react-admin'
import SendIcon from '@mui/icons-material/Send'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import PublicIcon from '@mui/icons-material/Public'
import CancelIcon from '@mui/icons-material/Cancel'
import RestoreIcon from '@mui/icons-material/Restore'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import authProvider from '../../../../authProvider'
import SuccessNotification from '../../../_components/SuccessNotification'
import useUserRole from '../../_components/useUserRole'
import {
  CRUD_ROLES,
  DEQ_ROLES,
  canCancel,
  canReinstate,
  sendReviewEmail,
} from '../../workflow'

interface ActionsMenuProps {
  anchorEl: HTMLElement | null
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  open: boolean
  setModalIsOpen: (isOpen: boolean) => void
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
  const role = useUserRole()
  const refresh = useRefresh()
  const [notification, setSendNotification] = useState(false)
  const [notificationText, setNotificationText] = useState('')

  const handleClose = () => setAnchorEl(null)

  const updateStatus = async (newStatus: string) => {
    const params: UpdateParams = {
      id: record.id,
      previousData: record,
      data: { status: newStatus },
    }
    await dataProvider.update('training-events', params)
    refresh()
    handleClose()
  }

  const handleSendForReview = async () => {
    const identity = await authProvider.getIdentity?.()
    await updateStatus('REVIEW')
    const sent = await sendReviewEmail(record, identity)
    setNotificationText(
      sent
        ? 'Event sent for review — the Training Manager has been notified.'
        : 'Event sent for review, but the notification email failed.'
    )
    setSendNotification(true)
  }

  const menuItemSx = { minWidth: 180 }

  return (
    <>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItemLink to={`/training-events/${record.id}/show`} onClick={handleClose} sx={menuItemSx}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Event</ListItemText>
        </MenuItemLink>
        {CRUD_ROLES.includes(role) && (
          <MenuItemLink to={`/training-events/${record.id}/edit`} onClick={handleClose} sx={menuItemSx}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Event</ListItemText>
          </MenuItemLink>
        )}

        {record.status === 'DRAFT' && CRUD_ROLES.includes(role) && (
          <MenuItem onClick={handleSendForReview} sx={menuItemSx}>
            <ListItemIcon>
              <UploadFileIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Send for Review</ListItemText>
          </MenuItem>
        )}
        {record.status === 'REVIEW' && DEQ_ROLES.includes(role) && (
          <MenuItem
            onClick={() => {
              setModalIsOpen(true)
              handleClose()
            }}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <SendIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Send to DEQ</ListItemText>
          </MenuItem>
        )}
        {record.status === 'DEQ' && DEQ_ROLES.includes(role) && (
          <MenuItem
            onClick={() => {
              setPostModalIsOpen(true)
              handleClose()
            }}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <PublicIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Post to Site</ListItemText>
          </MenuItem>
        )}

        {canCancel(record.status, role) && (
          <MenuItem onClick={() => updateStatus('CANCELLED')} sx={menuItemSx}>
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancel Event</ListItemText>
          </MenuItem>
        )}
        {canReinstate(record.status, role) && (
          <MenuItem onClick={() => updateStatus('DRAFT')} sx={menuItemSx}>
            <ListItemIcon>
              <RestoreIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Reinstate Event</ListItemText>
          </MenuItem>
        )}

        {(role === 'Admin' || CRUD_ROLES.includes(role)) && <Divider />}
        {role === 'Admin' && (
          <MenuItem sx={menuItemSx}>
            <CloneButton
              sx={{ justifyContent: 'flex-start', p: 0 }}
              label="Duplicate Event"
              fullWidth
              record={{
                ...record,
                address: record.address
                  ? {
                      id: null,
                      street: record.address.street,
                      city: record.address.city,
                      state: record.address.state,
                      zip: record.address.zip,
                    }
                  : null,
                schedule: record.schedule,
                status: 'DRAFT',
                deq_class_number: null,
              }}
            />
          </MenuItem>
        )}
        {CRUD_ROLES.includes(role) && (
          <MenuItem onClick={handleClose} sx={menuItemSx}>
            <DeleteButton
              size="small"
              sx={{ justifyContent: 'flex-start', p: 0 }}
              fullWidth
              label="Delete Event"
            />
          </MenuItem>
        )}
      </Menu>
      <SuccessNotification
        duration={5000}
        notification={notification}
        text={notificationText}
        setSendNotification={setSendNotification}
      />
    </>
  )
}
export default EventListActionsMenu
