import React from 'react'
import ActivityFeed from '../activity/ActivityFeed'
import { Grid } from "@mui/material"
import NextConferencsCard from './_components/ConferencesCard'
import StaffCard from './_components/StaffCard'
import InstructorsCard from './_components/TrainingInstructorCard'
import AssetsCard from './_components/AssetsCard'
import MembershipCard from './_components/MembershipsCard'


export interface DashboardStateFilter {
  entity: string
  entity_id: string
}


const Dashboard = () => {
  
  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 2 }}> 
      <Grid xs={12} sm={12} md={6} lg={4} sx={{ height: 400 }}>
        <StaffCard />
      </Grid>
      <Grid xs={12} sm={12} md={6} lg={4} sx={{ height: 400 }}>
        <MembershipCard/>   
      </Grid>
      <Grid xs={12} sm={12} md={6} lg={4} sx={{ height: 400 }}>
        <NextConferencsCard />
      </Grid>
      <Grid xs={12} sm={12} md={6} lg={4} sx={{ height: 390 }}>
        <ActivityFeed admin={true} sx={{height:'100%', width:'100%', borderRadius : '10px'}} title="Admin Dashboard" />
      </Grid>
      <Grid xs={12} sm={12} md={6} lg={4} sx={{ height: 390 }}>
        <InstructorsCard/>
      </Grid>
      <Grid xs={12} sm={12} md={6} lg={4} sx={{ height: 390 }}>
        <AssetsCard />
      </Grid>  
    </Grid>  
  )
}


export default Dashboard