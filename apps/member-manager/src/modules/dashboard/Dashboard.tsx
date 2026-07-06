import React from 'react'
import ActivityFeed from '../activity/ActivityFeed'
import { Grid } from '@mui/material'
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
    <Grid  justifyContent={'center'} mt={2} container spacing={2}> 
      <Grid item height={400} xs={12} sm={12} md={6} lg={4}>
        <StaffCard />
      </Grid>
      <Grid height={400} item xs={12} sm={12} md={6} lg={4}>
        <MembershipCard/>   
      </Grid>
      <Grid height={400} item xs={12} sm={12} md={6} lg={4  }>
        <NextConferencsCard />
      </Grid>
      <Grid height={390} item xs={12} sm={12} md={6} lg={4}>
        <ActivityFeed admin={true} sx={{height:'100%', width:'100%', borderRadius : '10px'}} title="Admin Dashboard" />
      </Grid>
      <Grid height={390} item xs={12} sm={12} md={6} lg={4}>
        <InstructorsCard/>
      </Grid>
      <Grid height={390} item xs={12} sm={12} md={6} lg={4}>
        <AssetsCard />
      </Grid>  
    </Grid>  
  )
}


export default Dashboard