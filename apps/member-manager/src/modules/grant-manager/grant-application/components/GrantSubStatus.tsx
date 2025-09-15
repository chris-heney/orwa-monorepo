import React, { Dispatch, SetStateAction } from 'react'
import { Identifier, Loading, RaRecord, TextField, useDataProvider, useGetList, useListContext, useRefresh } from 'react-admin'
import { Box, MenuItem, Select } from '@mui/material'
import getContrastColor from '../../../_helpers/getContrastColor'

interface GrantStatusProps {
  selectedApplication: RaRecord | null
  statusId: Identifier | undefined
  setSubEmail: Dispatch<SetStateAction<never[]>>
  applicationSubStatus: RaRecord 
  setApplicationSubStatus: Dispatch<SetStateAction<Status>>
}

interface Status {
  id: string
  name: string
  color: `#${string}`
}

const GrantSubStatus = ({ 
  statusId, 
  setSubEmail,  
  applicationSubStatus,
  setApplicationSubStatus 

}: GrantStatusProps) => {

  const dataProvider = useDataProvider()
  const { isLoading } = useListContext()
  const refresh = useRefresh()

  const { data: statusOptions, isLoading: isStatusLoading } = useGetList('grant-sub-statuses', {
    meta: { raw: true, populate: true },
    pagination: { page: 1, perPage: 100 },
    filter: { grant_statuses: [statusId] },
    sort: { field: 'order', order: 'ASC' },
  })

  if (!statusOptions) return <Loading />


  const updateStatus = async (e: { target: { value: string } }) => {
    // if (e.target.value !== 'New Reason') {
    // Only update status and refresh for options other than "New Reason"

    const { data: status } = await dataProvider.getOne('grant-sub-statuses', { id: e.target.value, meta: { raw: true } })


    setApplicationSubStatus(status)
    setSubEmail(status.email_template ?? [])
    // await dataProvider.update('grant-application-finals', { id: selectedApplication?.id, previousData: { ...selectedApplication }, data: { sub_status: status.id } })
    refresh()
  }

  return (isLoading || isStatusLoading || statusOptions?.length === 0 ) ? <Loading /> : (
    <Box>
      {typeof statusOptions !== 'undefined' && statusOptions?.length > 1 ? (
        <Select size='small'
          value={applicationSubStatus ? applicationSubStatus.id.toString() : ''}
          onChange={updateStatus}
          sx={{
            textAlign: 'center',
            mr: 2, width: 200,
            backgroundColor: applicationSubStatus ? applicationSubStatus.color : 'white',
            color: applicationSubStatus ? getContrastColor(applicationSubStatus.color, 0.3) : 'black',
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
              padding: 2,
              paddingLeft: 10,
              paddingRight: 10,
            }
          }}
          fullWidth>
          {/* Create New Reason Button */}
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
            backgroundColor: applicationSubStatus.color,
            p: 1,
            borderRadius: 1,
            fontWeight: 700,
            color: getContrastColor(applicationSubStatus.color, 0.3),
            width: '100%',
            display: 'block',
            textAlign: 'center',
            ':hover': {
              opacity: 0.8,
              backgroundColor: applicationSubStatus.color,
              color: getContrastColor(applicationSubStatus.color, 0.3),
            }
          }}
          label="Status"
        />
      )}
    </Box>
  )
}

export default GrantSubStatus