import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import {
  List,
  TextField,
  SimpleList,
  BooleanField,
  DatagridConfigurable,
  NumberField,
  ConfigurableDatagridColumn,
  useStore,
  ReferenceField,
  RaRecord,
  ReferenceArrayField,
  ChipField
} from 'react-admin'
import CustomExportFunction from '../../helpers/custom-export-function'
import { CurrencyOptions } from '../../config/Settings'
import CustomListActions from '../_components/CustomListActions'


const AssetList = () => {

  const preferenceKey = 'assets.datagrid'

  const [availableColumns] = useStore<
    ConfigurableDatagridColumn[]
  >(`preferences.${preferenceKey}.availableColumns`, [])

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )

  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'Assets')
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
  return (
    <List exporter={exporter} actions={<CustomListActions createButtonLabel="Add Asset" />}>
      {isSmall ? (
        <SimpleList primaryText={(record) => record.name + ' | ' + record.make}
          secondaryText={(record) => record.description} tertiaryText={(record) => '$' + record.fair_market_value} />
      ) : (
        <DatagridConfigurable
          bulkActionButtons={false}
          rowClick="show"
        >
          <TextField source="id" label="Asset ID" noWrap />
          <TextField source="name" label="Name" noWrap />
          <TextField source="category" label="Category" noWrap />
          <ReferenceField
            label="Assigned To"
            source="assigned_to"
            reference="staff"
            link="show"
            sx={{whiteSpace: 'nowrap'}}
          >
            <>
              <ReferenceField reference="contacts" source="contact" label="First Name" link={false}>
                <TextField source="first" label="First Name" noWrap/>
              </ReferenceField>
              {' '}
              <ReferenceField reference="contacts" source="contact" label="Last Name" link={false}>
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
          <NumberField source="fair_market_value" label="Market Value" options={CurrencyOptions} noWrap />
          <TextField source="description" label="Description" noWrap sx={{maxWidth: '200px', textOverflow: 'ellipsis', display: 'block'}} /> 
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
  )
}

export default AssetList