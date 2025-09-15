import {Box, Grid} from "@mui/material"
import React from 'react'
import { AutocompleteInput, NumberInput,ReferenceInput,TextInput } from 'react-admin'

const ScoringFormFields = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1}>
        <Grid xs={12} md={4}>
          <TextInput source="label" fullWidth helperText={false} />
        </Grid>
        <Grid sx={{ display: 'none' }}>
          <TextInput source="grant" defaultValue={4} />
        </Grid>
        <Grid xs={12} md={4}>
          <TextInput source="order" />
        </Grid>
        <Grid xs={12} md={4}>
          <NumberInput source="score" fullWidth  />
        </Grid>
        <Grid xs={12} md={12}>
          <TextInput source="icon" fullWidth helperText={false} multiline rows={3} />
        </Grid>
        <Grid xs={12} md={12}>
          <ReferenceInput source='project_type' reference='project-types' fullWidth helperText={false} label='Project Type'>
            <AutocompleteInput optionText={(record) => record.name + ' | ' + record.classification} />
          </ReferenceInput>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ScoringFormFields
