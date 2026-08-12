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
  FilterLiveSearch,
  ReferenceArrayField,
  SingleFieldList,
  ImageField
} from 'react-admin'
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useRefresh } from 'react-admin'
import { toRelationWriteId, toRelationWriteIds } from '../../../helpers/strapiIds'

const SubAssetAssignList = () => {
  const refresh = useRefresh()
  const dataProvider = useDataProvider()
  const { record } = useShowController()
  const [viewAll, setViewAll] = useState(false)
  const [listFilter, setListFilter] = useState<{ id: Identifier[] } | undefined>()

  if (typeof record === 'undefined' || !record) return null


  const handleCheckIn = async (asset: RaRecord) => {
    const updatedAssetParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        sub_assets: toRelationWriteIds(record.sub_assets).filter(
          (id) => id !== toRelationWriteId(asset)
        ),
      }
    }
    await dataProvider.update('assets', updatedAssetParams)
    refresh()

  }

  const assignAsset = async (asset: RaRecord) => {
    const updatedAssetParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        sub_assets: [
          ...toRelationWriteIds(record.sub_assets),
          toRelationWriteId(asset),
        ].filter((id): id is string | number => id != null),
      }
    }
    await dataProvider.update('assets', updatedAssetParams)
    refresh()
  }

  const handleViewAll = async () => {
    refresh()
    const asset = await dataProvider.getMany('assets',
      { ids: record.sub_assets.length > 0 ? record.sub_assets : null },)

    if (asset.data.length !== 0 && !viewAll) {
      setListFilter({ id: record.sub_assets })
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
    <List
      disableSyncWithLocation
      resource="assets"
      title={' '}
      filter={{ id: record.id }}
      actions={false}
      sx={{
        width: '100%',
        overflowY: 'scroll',
      }}
      queryOptions={{ meta: { operator: '$notIn' } }}
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
        <Typography variant="h6">Sub Assets</Typography>
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
      <Datagrid
        bulkActionButtons={false}>
        <ReferenceArrayField reference="upload/files" source="images" queryOptions={{ meta: { image: true } }}>
          <SingleFieldList linkType={false}>
            <ImageField source="url" title="title" sx={{ '& img.RaImageField-image': { width: 'auto', height: 60, m: 2 } }} />
          </SingleFieldList>
        </ReferenceArrayField>
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
              {record.sub_assets.includes(asset.id) ? (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleCheckIn(asset)}
                  sx={{ fontSize: 12, color: 'primary.main', borderColor: 'primary.main' }}
                >
                  Un Assign Sub Asset
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => assignAsset(asset)}
                  startIcon={<LibraryAddIcon />}
                  sx={{ fontSize: 12, color: 'success.contrastText' }}
                >
                  Assign Sub Asset
                </Button>
              )}
            </>
          )}
        />
      </Datagrid>
    </List>
  )
}

export default SubAssetAssignList
