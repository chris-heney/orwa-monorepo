import {Card, Grid} from "@mui/material"
import React from 'react'
import CustomHeader from '../../_components/CustomHeader'
import EmailInterface from '../../emails-magement/emails-templates/EmailInterface'
import OfficeDetails from './OfficeDetails'
import { Title } from 'react-admin'
import CustomInterface from './program-billed/CustomInterface'

const EventSettings = () => {
  return (
    <>
      <Title title='Settings' />
      <CustomHeader sx={{mt: 3}} title='Settings' />
      <Grid mt={-4} container spacing={2}>
        <Grid item xs={12} md={6}>
          <OfficeDetails/>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{mt: 2}}>
            <EmailInterface module='Training' />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>     
          <CustomInterface 
            rows={[
              { source: 'name', label: 'Name', type: 'number' },
              { source: 'description', label: 'Description', type: 'string'},
            ]}
            resource='programs' 
            title='Programs Billed' 
            createTitle='Create Program Billed'
          />
        </Grid>
        <Grid item xs={12} md={6}>     
          <CustomInterface
            rows={[
              { source: 'name', label: 'Name', type: 'number' },
              { source: 'description', label: 'Description', type: 'string'},
            ]}
            resource='training-topics' 
            title='Training Topics'
            createTitle='Create Training Topic' 
          />
        </Grid>
      </Grid>
    </>
  )
}

export default EventSettings
