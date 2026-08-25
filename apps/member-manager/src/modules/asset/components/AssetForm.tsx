import React from 'react'
import {
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  NumberInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  ImageInput,
  ImageField,
  Toolbar,
  SaveButton,
  DeleteButton,
  useRecordContext,
} from 'react-admin'
import { Box, Card, Divider, Grid, Typography } from '@mui/material'

const AssetFormToolbar = () => {
  const record = useRecordContext()
  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <SaveButton variant="contained" color="primary" sx={{ minWidth: 120 }} />
      {record?.id != null ? (
        <Box>
          <DeleteButton mutationMode="pessimistic" />
        </Box>
      ) : null}
    </Toolbar>
  )
}
import AssetValidate from '../AssetValidate'
import { AssetCategoryOptions, AssetLocationOptions, OrganizationType } from '../../../helpers/Data'
import CustomFormHeader from '../../_components/CustomFormHeader'
import { StaffAutocompleteInput } from '../../_components/autocompletes/StaffAutocomplete'
import { formSectionCardSx } from '../../../css/formLayout'


const AssetListForm = () => {
  return (
    <SimpleForm validate={AssetValidate} sx={{p: 0}} toolbar={<AssetFormToolbar />}>
      <CustomFormHeader
        redirectTo="/assets"
        displayField="name"
        hasShow={true}
      />
      <Grid container alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}> 
        <Grid item xs={12} md={6} lg={6} sm={12} alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Card sx={formSectionCardSx}>
            <Typography variant='h5' color="text.primary">Asset Details</Typography>
            <Grid container columnSpacing={2} alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
              <Grid item xs={12} lg={6}>
                <TextInput source="name" label="Name" fullWidth helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <SelectInput source="category" fullWidth label="Category" choices={AssetCategoryOptions} helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextInput source="make" fullWidth label="Make" helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextInput source="model" fullWidth label="Model" helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <NumberInput source="serial_number" fullWidth label="Serial Number" helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <BooleanInput source="tangible" fullWidth label="Tangible" helperText="Is this a physical item?" />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6} sm={12} alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Card sx={formSectionCardSx}>
            <Typography variant='h5' color="text.primary">Assignment Details</Typography>
            <Grid container columnSpacing={2} alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
              <Grid item xs={12} lg={6}>
                <SelectInput source="organization" fullWidth label="Organization" choices={OrganizationType} helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <SelectInput source="location" fullWidth label="Location" choices={AssetLocationOptions} helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <NumberInput source="fair_market_value" fullWidth label="Fair Market Value" helperText={false} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <StaffAutocompleteInput source='assigned_to'/>
              </Grid>
              <Grid item xs={12}>
                <ReferenceArrayInput
                  source="sub_assets"
                  reference="assets"
                  perPage={1000}
                >
                  <AutocompleteArrayInput optionText={'name'} />
                </ReferenceArrayInput>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{p: 1}}>
          <Divider sx={{mt:2}} />
        </Grid>
        <Grid item xs={12} alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Card sx={formSectionCardSx}>
            <TextInput source="description" fullWidth label="Description" helperText={false} />
            <ImageInput
              source="images"
              label="Images"
              fullWidth
              sx={{
                '& .RaFileInput-dropZone': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  py: 3,
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.selected',
                  },
                },
              }}
            >
              <ImageField source="url" title="title" />
            </ImageInput>
          </Card>
        </Grid>
      </Grid>
    </SimpleForm>
  )
}

export default AssetListForm
