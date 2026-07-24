import React, { useState } from 'react'
import {
  Datagrid,
  FunctionField,
  Identifier,
  List,
  RaRecord,
  ReferenceField,
  TextField,
  UpdateParams,
  useDataProvider,
  useShowController,
} from 'react-admin'
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useRefresh } from 'react-admin'

const StaffAssignList = () => {
  const refresh = useRefresh()
  const dataProvider = useDataProvider()
  const { record } = useShowController()
  const [viewAll, setViewAll] = useState(false)
  const [listFilter, setListFilter] = useState<{ assigned_assets: Identifier } | undefined>(undefined)

  if (typeof record === 'undefined' || !record) return null


  const handleCheckIn = async () => {
    const updatedAssetParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        assigned_to: null
      }
    }
    await dataProvider.update('assets', updatedAssetParams)
    setListFilter(undefined)
    refresh()
  }

  const assignStaff = async (staff: RaRecord) => {
    const updatedAssetParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        assigned_to: staff.id
      }
    }
    await dataProvider.update('assets', updatedAssetParams)
    refresh()
  }

  const handleViewAll = async () => {
    refresh()

    try {
      const staff = await dataProvider.getList('staff', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: { assigned_assets: record.id },
        meta: {
          raw: true,
          populate: true
        }
      })
      if (staff.data.length > 0 && !viewAll) {
        setListFilter({ assigned_assets: record.id })
        setViewAll((prevViewAll) => !prevViewAll)
      }
      else {
        setListFilter(undefined)
        if (!viewAll && staff.data.length === 0) {
          alert('No Staff Assigned to this Asset')
        }
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }


  return (
    <List
      disableSyncWithLocation
      resource="staff"
      title={' '}
      filter={listFilter}
      actions={false}
      sx={{
        width: '100%',
        overflowY: 'scroll',
      }}
    >

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          my: '1rem',
          position: 'sticky',
        }}
      >
        <Typography variant="h6">Staff</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button variant="contained" color="success" size="small" onClick={handleViewAll}>
            {viewAll ? 'View All' : 'Assigned'}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ width: '100%' }} />

      {/* Assets List Cells */}
      <Datagrid bulkActionButtons={false}>
        {/* <FunctionField
          sx={{ width: 50 }}
          label='Avatar'
          render={(staff: RaRecord) => {
            console.log(staff)
            return staff.avatar ?
              <Avatar
                src={staff.images}
                sx={{
                  width: 60,
                  height: 60,
                  mr: 1,
                  transition: 'transform 0.3s ease-in-out',
                  borderRadius: 0,
                  cursor: 'pointer',
                }}
              /> : <Typography>No Image</Typography>
          }} /> */}
        <ReferenceField reference='contacts' source='contact' label='Staff Member'>
          <>
            <TextField source='first' />
            {' '}
            <TextField source='last' />
          </>
        </ReferenceField>
        <FunctionField
          label="Actions"
          align="right"
          textAlign="right"
          render={(staff: RaRecord) => (
            <>
              {!staff.assigned_assets.indexOf(record.id) ? (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleCheckIn()}
                  sx={{ fontSize: 12, color: 'primary.main', borderColor: 'primary.main' }}
                >
                  Un Assign Staff
                </Button>
              ) : staff.assigned_asset ? (
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => assignStaff(staff)}
                  startIcon={<LibraryAddIcon />}
                  sx={{
                    fontSize: 12,
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText',
                    '&:hover': { bgcolor: 'warning.dark' },
                  }}
                >
                  Transfer Staff
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => assignStaff(staff)}
                  startIcon={<LibraryAddIcon />}
                  sx={{ fontSize: 12, color: 'success.contrastText' }}
                >
                  Assign Staff
                </Button>
              )}
            </>
          )}
        />
      </Datagrid>
    </List>
  )
}

export default StaffAssignList
