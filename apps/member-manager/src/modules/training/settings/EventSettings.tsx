import { Box, Card, Grid } from '@mui/material'
import React from 'react'
import PageHeadingBar from '../../_components/PageHeadingBar'
import EmailInterface from '../../emails-magement/emails-templates/EmailInterface'
import OfficeDetails from './OfficeDetails'
import { Title } from 'react-admin'
import CustomInterface from './program-billed/CustomInterface'

const EventSettings = () => {
  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box', p: { xs: 1, sm: 2 } }}>
      <Title title="Training Settings" />
      <PageHeadingBar
        title="Training Settings"
        info="Office details, training email templates, billed programs, and training topics."
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <OfficeDetails />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <EmailInterface module="Training" />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInterface
            rows={[
              { source: 'name', label: 'Name', type: 'number' },
              { source: 'description', label: 'Description', type: 'string' },
            ]}
            resource="programs"
            title="Programs Billed"
            createTitle="Create Program Billed"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInterface
            rows={[
              { source: 'name', label: 'Name', type: 'number' },
              { source: 'description', label: 'Description', type: 'string' },
            ]}
            resource="training-topics"
            title="Training Topics"
            createTitle="Create Training Topic"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default EventSettings
