import { Box, Grid } from '@mui/material'
import React from 'react'
import { SelectInput,TextInput } from 'react-admin'

const ProjectTypeFields = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container gap={1}>
        <Grid item xs={12} md={5.9}>
          <TextInput source="name" fullWidth helperText={false} />
        </Grid>
        <Grid item xs={12} md={5.9}>
          <SelectInput 
            source="classification" 
            fullWidth 
            helperText={false} 
            choices={[
              { id: 'Wastewater', name: 'Wastewater' },
              { id: 'Drinking Water', name: 'Drinking Water' },
              { id: 'Both', name: 'Both'}
            ]}
          />
        </Grid>
        <Grid item xs={12} md={5.9}>
          <SelectInput 
            source="context" 
            fullWidth 
            helperText={false} 
            choices={[
              { id: 'Project Type', name: 'Project Type' },
              { id: 'Project Status and Impact', name: 'Project Status and Impact' },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextInput source="description" fullWidth helperText={false} multiline rows={3} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProjectTypeFields
