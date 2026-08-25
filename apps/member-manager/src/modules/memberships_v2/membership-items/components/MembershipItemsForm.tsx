import React from 'react'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { NumberInput, ReferenceArrayInput, AutocompleteArrayInput, SimpleForm, TextInput } from 'react-admin'
import CustomEditHeader from '../../../_components/CustomFormHeader'
import { formSectionCardSx } from '../../../../css/formLayout'

const MembershipItemsForm = () => {
  return (
    <SimpleForm sx={{ p: 0 }}>
      <CustomEditHeader hasShow={false}/>
      <Box alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
        <Box sx={formSectionCardSx}>
          <Typography variant='h5'>Membership Item Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextInput source="name" label="Name" helperText={false} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberInput source="price" label="Price" helperText={false} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberInput source="max_price" label="Max Price" helperText={false} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberInput source="max_purchasable" label="Max Purchasable" helperText={false} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumberInput source="min_purchasable" label="Min Purchasable" helperText={false} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReferenceArrayInput source="memberships" label="Included Memberships" reference="memberships">
                <AutocompleteArrayInput optionText="name" />
              </ReferenceArrayInput>
            </Grid>
            <Grid item xs={12}>
              <TextInput source="description" label="Description" helperText={false} fullWidth multiline rows={5} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SimpleForm>
  )
}

export default MembershipItemsForm