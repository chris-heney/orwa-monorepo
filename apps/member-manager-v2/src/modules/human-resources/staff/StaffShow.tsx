import React, { useState } from 'react'
import {
  Datagrid,
  FunctionField,
  Identifier,
  List,
  RaRecord,
  ReferenceField,
  Show,
  TextField,
  UpdateParams,
  useDataProvider,
  useShowController,
  FilterLiveSearch
} from 'react-admin'
import {
  Box,
  Button,
  Divider,
  Typography,
  Avatar,
  Grid
} from '@mui/material'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import StaffCard from './_components/StaffCard'
import ActivityFeed from '../../activity/ActivityFeed'
import { useRefresh } from 'react-admin'
import ShowHeader from '../_components/ShowHeader'

const StaffShow = () => {
  const refresh = useRefresh()
  const dataProvider = useDataProvider()
  const { record } = useShowController()
  const [viewAll, setViewAll] = useState(false)
  const [listFilter, setListFilter] = useState<{ assigned_to: Identifier } | undefined>(undefined)

  if (typeof record === 'undefined' || !record) return null


  const handleCheckIn = async (asset: RaRecord) => {
    const updatedAssetParams: UpdateParams = {
      id: asset.id,
      previousData: asset,
      data: {
        assigned_to: null
      }
    }
    await dataProvider.update('assets', updatedAssetParams)
    refresh()

  }

  const assignAsset = async (asset: RaRecord) => {
    const updatedAssetParams: UpdateParams = {
      id: asset.id,
      previousData: asset,
      data: {
        assigned_to: record.id
      }
    }
    await dataProvider.update('assets', updatedAssetParams)
    refresh()
  }

  const handleViewAll = async () => {
    refresh()
    const asset = await dataProvider.getMany('assets',
      { ids: record.assigned_assets.length > 0 ? record.assigned_assets : [20] },)

    if (asset.data.length !== 0 && !viewAll) {
      setListFilter({ assigned_to: record.id })
    }
    else {
      setListFilter(undefined)
      if (!viewAll && asset.data.length === 0) {
        alert('No Assets Assigned')
      }
    }
    setViewAll((prevViewAll) => !prevViewAll)
  }


  return (
    <Show actions={false} title="Staff" component="div">
      <Grid justifyContent={'center'} mt={2} container spacing={2}>
      <ShowHeader first={""} last={""} />

        <Grid item xs={12} lg={3}>
          {/* Staff Information Card */}
          
          <Grid justifyContent={'center'} mt={-2} container spacing={2}>
            <StaffCard />
            <ActivityFeed sx={{ width: '100%', mt: 2, maxHeight:465 }} title={' '} entity="staff" entity_id={record.id} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={9}>
          <List
            disableSyncWithLocation
            resource="assets"
            title={' '}
            filter={listFilter}
            actions={false}
            sx={{
              mt: -2,
              width: '100%',
              overflowY: 'scroll',
            }}
          >
            {/* Header Section */}

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
              <Typography variant="h6">Assets</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FilterLiveSearch sx={{ mr: 1 }} />

                <Button variant="contained" color="success" size="small" onClick={handleViewAll}>
                  {viewAll ? 'View All' : 'Assigned'}
                </Button>
              </Box>
            </Box>
            <Divider sx={{ width: '100%' }} />

            {/* Assets List Cells */}
            <Datagrid bulkActionButtons={false}>
              <FunctionField
                sx={{ width: 50 }}
                label='Image'
                render={(asset: RaRecord) => {
                  return asset.images[0] ?
                    <Avatar
                      src={asset.images[0].url}
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 1,
                        transition: 'transform 0.3s ease-in-out',
                        borderRadius: 0,
                        cursor: 'pointer',
                      }}
                    /> : <Typography>No Image</Typography>
                }} />
              <ReferenceField source="id" reference="assets" link="show" label="Asset">
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <TextField source="name" fontSize={16} />
                  <TextField source="serial_number" />
                </Box>
              </ReferenceField>
              <FunctionField
                label="Actions"
                align="right"
                textAlign="right"
                render={(asset: RaRecord) => (
                  <>
                    {asset.assigned_to === record.id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCheckIn(asset)}
                      >
                        <Typography fontSize={12}>Check In</Typography>
                      </Button>
                    ) : asset.assigned_to ? (
                      <Button
                        variant="contained"
                        style={{ backgroundColor: '#F6EC57' }}
                        size="small"
                        onClick={() => assignAsset(asset)}
                      >
                        <LibraryAddIcon sx={{ mr: 1 }} />
                        <Typography fontSize={12}>Transfer Asset</Typography>
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => assignAsset(asset)}
                      >
                        <LibraryAddIcon sx={{ mr: 1 }} />
                        <Typography fontSize={12}>Assign Asset</Typography>
                      </Button>
                    )}
                  </>
                )}
              />
            </Datagrid>
          </List>
        </Grid>
      </Grid>
    </Show>
  )
}

export default StaffShow
