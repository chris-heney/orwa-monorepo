import { Box, Card, Grid } from '@mui/material'
import React from 'react'
import EmailInterface from '../../emails-magement/emails-templates/EmailInterface'
import GrantStatusesInterface from './StatusesInterface'
import CustomInterface from '../../training/settings/program-billed/CustomInterface'
import ProjectTypeFields from './ProjectTypeFields'
import ScoringFormFields from './ScoringFormFields'

const GrantManagementSettings = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <GrantStatusesInterface context='grant-statuses' />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <EmailInterface module="Grant Management" />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <GrantStatusesInterface context='grant-sub-statuses' />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInterface
            InputFields={() => <ScoringFormFields />}
            rows={[
              { source: 'label', label: 'Label', type: 'string' },
              { source: 'order', label: 'Order', type: 'string' },
              { source: 'score', label: 'Score', type: 'number' },
            ]}
            resource='grant-application-scorings'
            title='Scoring Criterias'
            createTitle='Add New Scoring Criteria'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <GrantStatusesInterface context='payout-statuses' />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CustomInterface
              InputFields={() => <ProjectTypeFields />}
              rows={[
                { source: 'name', label: 'Name', type: 'string' },
                { source: 'classification', label: 'Classification', type: 'string' },
                { source: 'description', label: 'Description', type: 'string' },
                { source: 'context', label: 'Context', type: 'string' },
              ]}
              resource='project-types'
              title='Project Types'
              createTitle='New Project Type'
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CustomInterface
              rows={[
                { source: 'name', label: 'Name', type: 'string' },
                { source: 'default_member_name', label: 'Defualt Name', type: 'string' },
                { source: 'default_member_email', label: 'Default Email', type: 'string' },
              ]}
              inputs={[
                {source: 'name', label: 'Name', type: 'string'},
                {source: 'public_key', label: 'Public Key', type: 'string'},
                { source: 'default_member_name', label: 'Defualt Name', type: 'string' },
                { source: 'default_member_email', label: 'Default Email', type: 'string' },
                { source: 'order', label: 'Order', type: 'number' },
                {source: 'application_status', label: 'Application Status', type: 'reference', refernece: 'grant-statuses'},
                {source: 'next_status', label: 'Next Status', type: 'reference', refernece: 'grant-statuses'},
              ]}
              resource='grant-scoring-tokens'
              title='Gapp Scoring Tokens'
              createTitle='New Gapp Scoring Token'
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default GrantManagementSettings
