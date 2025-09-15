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
  useRecordContext,
} from 'react-admin'
import {Card, Divider, Grid, Typography} from "@mui/material"
import AssetValidate from '../AssetValidate'
import { AssetCategoryOptions, AssetLocationOptions, OrganizationType } from '../../../helpers/Data'
import CustomHeader from '../../_components/CustomHeader'
import { StaffAutocompleteInput } from '../../_components/autocompletes/StaffAutocomplete'


const AssetListForm = () => {

  const asset = useRecordContext()
  const title = asset ? `${asset.name}` : 'New Asset'

  return (
    <SimpleForm validate={AssetValidate} sx={{p: 0}}>
      <CustomHeader title={title} />
      <Grid container sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}> 
        <Grid xs={12} md={6} lg={6} sm={12} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <Typography variant='h5'>Asset Details</Typography>
            <Grid container columnSpacing={2} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
              <Grid xs={12} lg={6}>
                <TextInput source="name" label="Name" fullWidth helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <SelectInput source="category" fullWidth label="Category" choices={AssetCategoryOptions} helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <TextInput source="make" fullWidth label="Make" helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <TextInput source="model" fullWidth label="Model" helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <NumberInput source="serial_number" fullWidth label="Serial Number" helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <BooleanInput source="tangible" fullWidth label="Tangible" helperText="Is this a physical item?" />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={6} sm={12} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <Typography variant='h5'>Assignment Details</Typography>
            <Grid container columnSpacing={2} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
              <Grid xs={12} lg={6}>
                <SelectInput source="organization" fullWidth label="Organization" choices={OrganizationType} helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <SelectInput source="location" fullWidth label="Location" choices={AssetLocationOptions} helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <NumberInput source="fair_market_value" fullWidth label="Fair Market Value" helperText={false} />
              </Grid>
              <Grid xs={12} lg={6}>
                <StaffAutocompleteInput source='assigned_to'/>
              </Grid>
              <Grid xs={12}>
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
        <Grid xs={12} sx={{p: 1}}>
          <Divider sx={{mt:2}} />
        </Grid>
        <Grid xs={12} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <TextInput source="description" fullWidth label="Description" helperText={false} />
            <ImageInput source="images" label="Images" fullWidth >
              <ImageField source="url" title="title" />
            </ImageInput>
          </Card>
        </Grid>
      </Grid>
    </SimpleForm>
  )
}

export default AssetListForm
