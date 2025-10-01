import React from 'react'
import {Box, Card, Divider, Grid, Typography} from "@mui/material"
import { AutocompleteArrayInput, AutocompleteInput, ReferenceArrayInput, ReferenceInput } from 'react-admin'

const StaffFormFields = () => {
  return (
    <Box width={'100%'} >
      <Grid container spacing={0} gap={0} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
        <Grid item sx={{ width: '100%' }} lg={12} alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
          {/* Instructor Details */}
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none" }}>
            <Typography variant='h5'>Staff Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <ReferenceInput source="contact" label="contacts" reference="Contacts" perPage={1000} fullWidth>
                <AutocompleteInput helperText={false} optionText={(choice) => `${choice.id} - ${choice.email}`} />
              </ReferenceInput>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <ReferenceArrayInput
                source="assigned_assets"
                reference="assets"
                perPage={1000}
              >
                <AutocompleteArrayInput optionText={'name'} />
              </ReferenceArrayInput>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StaffFormFields



