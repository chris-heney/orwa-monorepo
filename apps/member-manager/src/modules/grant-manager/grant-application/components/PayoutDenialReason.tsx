import React, { useState } from 'react'
import { Loading, useGetList, useListContext, useRefresh } from 'react-admin'
import { Box, MenuItem, Modal, Select, Typography } from '@mui/material'
import ModalDenialReason from './ModalDenialReason'
import ApplicationEmailModal from './ApplicationEmailModal'
import { useGrantContext } from '../../GrantContextProvider'


interface GrantStatusProps {
  setStatusId: React.Dispatch<React.SetStateAction<null | number>>
}

const PayoutDenialReason = ({ setStatusId }: GrantStatusProps) => {

  const { isLoading } = useListContext()
  const refresh = useRefresh()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const grantContext = useGrantContext()

  const [status, setStatus] = React.useState(6)

  const updateStatus = async (e: { target: { value: string } }) => {
    if (e.target.value !== 'New Reason') {
      // Only update status and refresh for options other than "New Reason"
      setStatus(parseInt(e.target.value))
      setStatusId(parseInt(e.target.value))

      refresh()
    }
    if (e.target.value === 'New Reason') {
      setIsModalOpen(true)
    }
  }

  const { data: statusOptions, isLoading: isStatusLoading } = useGetList('grant-sub-statuses', {
    meta: { raw: true, populate: true },
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'order', order: 'ASC' },
  })

  const getStatusColor = (statusId: number) => {
    return statusOptions?.find((status) => status.id === statusId)?.color
  }

  return (isLoading || isStatusLoading && statusOptions) ? <Loading /> : (
    <Box>
      {grantContext.selectedTab === 'payouts' &&
        <Typography variant='subtitle1' sx={{ textAlign: 'left' }}>Denial Reason</Typography>
      }
      <Select size='small'
        value={status.toString()}
        onChange={updateStatus}
        sx={{
          textAlign: 'center', mr: 2,
          backgroundColor: getStatusColor(status),
        }}
        fullWidth>
        {/* Create New Reason Button */}
        <MenuItem value={'New Reason'}>New Denial Reason</MenuItem>
        {statusOptions?.map((status, index) => (
          <MenuItem sx={{ backgroundColor: status.color }} key={`status-${index}`} value={status.id}>{status.name}</MenuItem>
        ))}
      </Select>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <><ModalDenialReason setIsModalOpen={setIsModalOpen} /></>
      </Modal>
      <Modal
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <><ApplicationEmailModal setIsModalOpen={setIsEmailModalOpen} /></>
      </Modal>
    </Box>
  )
}

export default PayoutDenialReason
