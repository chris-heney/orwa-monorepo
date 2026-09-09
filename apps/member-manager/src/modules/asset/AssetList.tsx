import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import {
  ListView,
  TextField,
  SimpleList,
  BooleanField,
  NumberField,
  ConfigurableDatagridColumn,
  ReferenceField,
  RaRecord,
  ReferenceArrayField,
  ChipField,
} from 'react-admin';
import { DatagridConfigurable } from '@orwa/entity-id';
import CustomExportFunction from '../../helpers/custom-export-function';
import { CurrencyOptions } from '../../config/Settings';
import type { ListManifest } from '../../framework/manifest';

export const ASSET_PREFERENCE_KEY = 'assets.datagrid';

/**
 * Assets export: the configurable-datagrid columns live in RaStore
 * (`preferences.assets.datagrid.*`); read them through the page ctx.
 */
export const exportAssets: NonNullable<ListManifest['exporter']> = (
  records,
  ctx,
  { dataProvider }
) => {
  const availableColumns = ctx.store<ConfigurableDatagridColumn[]>(
    `preferences.${ASSET_PREFERENCE_KEY}.availableColumns`,
    []
  );
  const columnIds = ctx.store<string[]>(
    `preferences.${ASSET_PREFERENCE_KEY}.columns`,
    []
  );
  CustomExportFunction(
    records,
    availableColumns,
    columnIds,
    'Assets',
    dataProvider
  );
};

const assetListSx: SxProps<Theme> = {
  '& .RaList-main': { marginTop: 0 },
  '& .RaList-content': {
    boxShadow: 'none',
    bgcolor: 'background.paper',
  },
  '& .RaDatagrid-headerCell': {
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
    color: 'text.primary',
  },
  '& .RaDatagrid-rowCell': {
    color: 'text.primary',
  },
};

/** Body of the `assets.list` page — renders inside the page's ListScope. */
const AssetList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <ListView title=" " actions={false} sx={assetListSx}>
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
    </ListView>
  );
};

export default AssetList;
