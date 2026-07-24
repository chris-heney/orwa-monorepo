import React, { Dispatch, SetStateAction } from 'react'
import { Identifier, Loading, RaRecord, TextField, useDataProvider, useGetList, useGetOne, useListContext, useNotify, useRecordContext, useRefresh } from 'react-admin'
import { MenuItem, Select } from '@mui/material'
import getContrastColor from '../../../_helpers/getContrastColor'
import { sendActivity } from '../../../../helpers/sendActivity'
import { useGrantContext } from '../../GrantContextProvider'

interface GrantStatusProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsEmailModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setApplicationStatus: Dispatch<SetStateAction<RaRecord<Identifier> | null>>
  setSelectedApplication: Dispatch<SetStateAction<RaRecord<Identifier> | null>>
  applicationStatus: RaRecord<Identifier> | null
  fullWidth?: boolean
  allStatuses?: boolean
}


const GrantStatus = ({ 
  setIsModalOpen, 
  setIsEmailModalOpen, 
  setApplicationStatus, 
  setSelectedApplication,
  applicationStatus,
  fullWidth = false,
  allStatuses,
}: GrantStatusProps) => {


  const { isLoading } = useListContext()
  const record = useRecordContext()

  const [status, setStatus] = React.useState(record.status === null ? 5 : record.status.id)
  const dataProvider = useDataProvider()
  const {godMode} = useGrantContext()
  const notify = useNotify()
  const refresh = useRefresh()

  const updateStatus = async (e: { target: { value: string } }) => {
    // if (e.target.value !== 'New Reason') {
    // Only update status and refresh for options other than "New Reason"
    const { data: status } = await dataProvider.getOne('grant-statuses', { id: e.target.value, meta: { raw: true } })

    setApplicationStatus(status)
    setStatus(status.id)
    setSelectedApplication(record)
   

    if (status?.email_templates.length > 0) {

      setIsEmailModalOpen(true)

    } else {
      try {
        await dataProvider.update('grant-application-finals', { id: record.id, previousData: { ...record }, data: { status: status } })
        notify(`Grant Application was Updated to ${status.name}`, { type: 'success' })

        // Send Activity to Activity Log
        await sendActivity(dataProvider, 'grant-application', `Grant Application Was Updated to ${status?.name}`, [record?.id])

      } catch (error) {
        notify(`Error updating Grant Application to ${status.name}`, { type: 'error' })
        console.error(error)
      }
    }
    // if new reasons is selected, open modal to create new status
    if (e.target.value === 'New Reason') {
      setIsModalOpen(true)
    }
    refresh()
  }

  const { data: rawStatus, isLoading: isRawLoading } = useGetOne('grant-statuses', { id: status })

  const { data: statusOptions, isLoading: isStatusLoading } = useGetList('grant-statuses', {
    meta: { raw: true, populate: true },
    pagination: { page: 1, perPage: 100 },
    filter: (godMode || allStatuses) ? {} : { id: rawStatus?.next_statuses.concat(rawStatus.id).concat(applicationStatus?.id)},
    sort: { field: 'order', order: 'ASC' },
  })

  return (isLoading || isStatusLoading || isRawLoading) ? <Loading /> : (
    <div id={`checkbox-cell-${record.id}`}>
      {typeof statusOptions !== 'undefined' && statusOptions?.length > 0 ? (
        <Select size='small'
          value={rawStatus.id}
          onChange={updateStatus}
          sx={{
            textAlign: 'center', width: fullWidth ? '100%' : 50,
            backgroundColor: rawStatus.color,
            color: getContrastColor(rawStatus.color, 0.3),
            '& .MuiSelect-select': {
              color: 'inherit',
            },
            '& .MuiSvgIcon-root': {
              color: 'inherit',
            },
            '& .css-6hp17o-MuiList-root-MuiMenu-list': {
              paddingTop: 0,
              paddingBottom: 0,
            }
          }}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
            }
          }}
          SelectDisplayProps={{
            style: {
              padding: fullWidth ? 10 : 2,
              paddingLeft: 10,
              paddingRight: 10,
            }
          }}
          fullWidth>
          {/* Create New Reason Button */}
          {/* <MenuItem value={'New Reason'}>New Status</MenuItem> */}
          {statusOptions?.map((status, index) => (
            <MenuItem
              sx={{
                backgroundColor: status.color,
                color: getContrastColor(status.color, 0.3), 
                py: .1,
                justifyContent: 'center', 
                ':hover': {
                  opacity: 0.8,
                  backgroundColor: status.color,
                  color: getContrastColor(status.color, 0.3),
                },
                '&.Mui-selected': {
                  backgroundColor: status.color,
                  color: getContrastColor(status.color, 0.3),
                  '&:hover': {

                    backgroundColor: status.color,
                    color: getContrastColor(status.color, 0.3),
                  }
                },
              }}
              key={`status-${index}`}
              value={status.id}>{status.name}</MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          source="status.name"
          sx={{
            whiteSpace: 'nowrap',
            backgroundColor: rawStatus.color,
            p: .5,
            borderRadius: 1,
            fontWeight: 700,
            color: getContrastColor(rawStatus.color, 0.3),
            width: '93%',
            display: 'block',
            textAlign: 'center',
          }}
          label="Status"
        />
      )}
    </div>
  )
}

export default GrantStatus
