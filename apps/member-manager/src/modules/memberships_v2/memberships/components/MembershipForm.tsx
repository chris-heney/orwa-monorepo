import React from 'react'
import {Box, Divider, Grid, Typography} from "@mui/material"
import { AutocompleteArrayInput, NumberInput, ReferenceArrayInput, SelectInput, SimpleForm, TextInput } from 'react-admin'
import CustomEditHeader from '../../../_components/CustomFormHeader'

const MembershipForm = () => {

  return (
    <SimpleForm sx={{ p: 0 }} >
      <CustomEditHeader hasShow={false}/>
      <Box alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
        <Box sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant='h5'>Membership Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={1}>
            <Grid xs={12} sm={6}>
              <TextInput source="name" label="Name" helperText={false} fullWidth />
            </Grid>
            <Grid xs={12} sm={6}>
              <NumberInput source="price" label="Price" helperText={false} fullWidth />
            </Grid>
            <Grid xs={12} sm={6}>
              <ReferenceArrayInput source="items" label="Items" reference="membership-items">
                <AutocompleteArrayInput optionText="name" />
              </ReferenceArrayInput>
            </Grid>
            <Grid xs={12} sm={6}>
              <SelectInput source="context" label="Context" fullWidth choices={[
                { id: 'Watersystem', name: 'Watersystem' },
                { id: 'Associate', name: 'Associate' },
              ]}
              />
            </Grid>
            <Grid xs={12}>
              <TextInput source="description" label="Description" helperText={false} fullWidth multiline rows={5} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SimpleForm>

  )
}


export default MembershipForm

