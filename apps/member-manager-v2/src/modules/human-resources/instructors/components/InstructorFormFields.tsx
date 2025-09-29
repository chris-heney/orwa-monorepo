import { ReferenceInput, AutocompleteInput, NumberInput } from 'react-admin'
import {Box, Card, Divider, Grid, Typography} from "@mui/material"
import React from 'react'


const InstructorFormFields = () => {

  return (
    <Box width={'100%'}>
      <Grid container spacing={0} gap={0} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
        <Grid sx={{ width: '100%' }} lg={12}  alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none"}}>
            <Typography variant='h5'>Instructor Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container columnSpacing={2}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <ReferenceInput source="instructor" label="contacts" reference="Contacts" filter={{ contact_type: 'Staff' }} perPage={1000} fullWidth>
                  <AutocompleteInput optionText={(choice) => `${choice.first}` + ' ' + `${choice.last}`} />
                </ReferenceInput>
              </Grid>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <NumberInput source="operator_license" label="Operator License" fullWidth />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}


export default InstructorFormFields
