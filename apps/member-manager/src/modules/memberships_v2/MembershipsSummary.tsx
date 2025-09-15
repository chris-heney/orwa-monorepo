import { Box, Grid } from '@mui/material'
import React from 'react'
import { FinancialAuditDashboard } from '../dashboards'
import MembershipsCard from '../dashboard/_components/MembershipsCard'
import MembershipReportCard from './componenets/MembershipReportCard'

const MembershipsSummary = () => {
  return (
    <Box>
      <Box sx={{
        p: 3, flexGrow: 1
      }}>
             
        <Box>
          <Grid container rowSpacing={1} columnSpacing={3}>
            <Grid item  xs={12} md={6}>
              <MembershipsCard />
            </Grid>
            {/* Membership Report */}
            <Grid item  xs={12} md={6}>
              <MembershipReportCard/>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <FinancialAuditDashboard/>
    </Box>
  )
}

export default MembershipsSummary
