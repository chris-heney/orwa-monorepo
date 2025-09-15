import {Divider, Grid, Typography} from "@mui/material"
import React from 'react'
import { Edit, SimpleForm, TextInput } from 'react-admin'
import CustomPhoneInput from '../../_components/MaskedPhoneInput'

const OfficeDetails = () => {
  return (
    <Edit title={' '} resource='training-settings' redirect='edit' >
      <SimpleForm>
        <Typography variant='h6'>Office Details</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <TextInput fullWidth source='street' label='Street' />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <TextInput fullWidth source='city' label='City' />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <TextInput fullWidth source='state' label='State' />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <TextInput fullWidth source='zip' label='Zip' />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <CustomPhoneInput fullWidth source='phone' label='Phone' />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <CustomPhoneInput fullWidth source='fax' label='Fax' />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            <TextInput fullWidth source='hours' label='Office Hours' />
          </Grid>
        </Grid>
      </SimpleForm>
    </Edit>
  )
}

export default OfficeDetails
