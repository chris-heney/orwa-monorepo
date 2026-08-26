import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import {
  List,
  TextField,
  SimpleList,
  BooleanField,
  NumberField,
  ConfigurableDatagridColumn,
  useStore,
  ReferenceField,
  RaRecord,
  ReferenceArrayField,
  ChipField,
  Title,
  ExportButton,
  SelectColumnsButton,
  useListContext,
  useDataProvider,
} from 'react-admin'
import { DatagridConfigurable } from '@orwa/entity-id'
import CustomExportFunction from '../../helpers/custom-export-function'
import { CurrencyOptions } from '../../config/Settings'
import CreateButton from '../_components/CustomCreateButton'
import PageHeadingBar from '../_components/PageHeadingBar'

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
}

const AssetListHeader = () => {
  const { total } = useListContext()
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <PageHeadingBar
      title="Asset Manager"
      info="Track tangible and intangible assets, assignments, and fair market value."
      actions={
        <>
          {total != null && total > 0 && (
            <Box
              component="span"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: isSmall ? '0.7rem' : '0.875rem',
                mr: 0.5,
              }}
            >
              {total} Records
            </Box>
          )}
          <CreateButton label="Add Asset" sx={barButtonSx} />
          {!isSmall && <SelectColumnsButton sx={barButtonSx} />}
          <ExportButton sx={barButtonSx} />
        </>
      }
    />
  )
}

const AssetList = () => {
  const preferenceKey = 'assets.datagrid'

  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  )

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )

  const dataProvider = useDataProvider()
  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      'Assets',
      dataProvider
    )
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box' }}>
      <Title title="Asset Manager" />
      <List
        title=" "
        exporter={exporter}
        actions={false}
        sx={{
          '& .RaList-main': { marginTop: 0 },
          '& .RaList-content': {
            boxShadow: 'none',
            bgcolor: 'background.paper',
          },
          '& .RaDatagrid-headerCell': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
            color: 'text.primary',
          },
          '& .RaDatagrid-rowCell': {
            color: 'text.primary',
          },
        }}
      >
        <AssetListHeader />
        {isSmall ? (
          <SimpleList
            primaryText={(record) => record.name + ' | ' + record.make}
            secondaryText={(record) => record.description}
            tertiaryText={(record) => '$' + record.fair_market_value}
          />
        ) : (
          <DatagridConfigurable bulkActionButtons={false} rowClick="show">
            <TextField source="id" label="Asset ID" noWrap />
            <TextField source="name" label="Name" noWrap />
            <TextField source="category" label="Category" noWrap />
            <ReferenceField
              label="Assigned To"
              source="assigned_to"
              reference="staff"
              link="show"
              sx={{ whiteSpace: 'nowrap' }}
            >
              <>
                <ReferenceField
                  reference="contacts"
                  source="contact"
                  label="First Name"
                  link={false}
                >
                  <TextField source="first" label="First Name" noWrap />
                </ReferenceField>{' '}
                <ReferenceField
                  reference="contacts"
                  source="contact"
                  label="Last Name"
                  link={false}
                >
                  <TextField source="last" label="Last Name" noWrap />
                </ReferenceField>
              </>
            </ReferenceField>
            <BooleanField source="tangible" label="Tangible" noWrap />
            <TextField source="make" label="Make" noWrap />
            <TextField source="model" label="Model" noWrap />
            <TextField source="organization" label="Organization" noWrap />
            <TextField source="location" label="Location" noWrap />
            <TextField source="serial_number" label="Serial Number" noWrap />
            <NumberField
              source="fair_market_value"
              label="Market Value"
              options={CurrencyOptions}
              noWrap
            />
            <TextField
              source="description"
              label="Description"
              noWrap
              sx={{
                maxWidth: '200px',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            />
            <ReferenceArrayField
              source="sub_assets"
              label="Sub Assets"
              reference="assets"
            >
              <Box>
                <ReferenceField
                  source="id"
                  link={(record: RaRecord) => `/assets/${record.id}/show`}
                  reference="assets"
                >
                  <ChipField source="name" />
                </ReferenceField>
              </Box>
            </ReferenceArrayField>
          </DatagridConfigurable>
        )}
      </List>
    </Box>
  )
}

export default AssetList
