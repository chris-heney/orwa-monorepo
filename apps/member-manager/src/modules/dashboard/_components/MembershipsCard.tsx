import React from 'react'
import { Card, Box, Typography, Grid} from '@mui/material'
import { Doughnut } from 'react-chartjs-2'
import MembersIcon from '@mui/icons-material/Diversity1'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js'
import { Loading, useGetList } from 'react-admin'
import { oneYearAgoFormatted } from '../../memberships_v2/helpers/activeOrInactiveMembership'

const MembershipsCard = () => {

  const { data: associates, isLoading: isAssociatesLoading } = useGetList('associates', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })  

  const activeAssociates = associates?.filter(associate => associate.payment_last_date > oneYearAgoFormatted)

  const { data: watersystems, isLoading: isWaterSystemsLoading } = useGetList('watersystems', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  const activeWaterSystems = watersystems?.filter(system => system.payment_last_date > oneYearAgoFormatted)

  ChartJS.register(ArcElement, Tooltip, Legend)

  if (
    !associates 
    || !watersystems
    || !activeAssociates 
    || !activeWaterSystems
  ) {
    return <Loading />
  }

  const donutChartData = [
    { label: 'Active Associates', value: activeAssociates?.length },
    { label: 'Inactive Associates', value: (associates.length - activeAssociates.length) },
    { label: 'Active Water Systems', value: activeWaterSystems?.length },
    { label: 'Inactive Water Systems', value: (watersystems.length - activeWaterSystems?.length) },
  ]

  const chartData = {
    labels: donutChartData.map(item => item.label),
    datasets: [
      {
        data: donutChartData.map(item => item.value),
        backgroundColor: ['#4CAF50', '#FF5252', '#2196F3', '#FFC107'],
      },
    ],
  }

  const chartOptions: ChartOptions<'doughnut'> = {
    cutout: '50%', // Adjust this value to control the size of the hole in the middle
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0)
            const percentage = ((value / total) * 100).toFixed(2) + '%'
            return `${label}: ${percentage}`
          },
        },
      },
    },
  }

  const gridItemStyles = {
    padding: '10px',
    color: '#FFFF', // Dark gray text color
  }

  return isAssociatesLoading || isWaterSystemsLoading ? (
    <Loading />
  ) : (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        backgroundColor: '#474747', // Black background
        color: '#ffffff', // White text color
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Box sx={{ py: 1, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <MembersIcon sx={{ fontSize: 30 }} />
        <Typography ml={2} textAlign={'center'} variant="h5">
          Memberships
        </Typography>
      </Box>
      <Box sx={{ display:'flex', justifyContent: 'center', ml: 2, height: '65%'}}>
        <Doughnut style={{
          maxWidth: 200,
          maxHeight: 200,
        }} key='membership-chart'  id='memberships' data={chartData} options={chartOptions} />
      </Box>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Grid container spacing={1}>
          {donutChartData.map((item, index) => (
            <Grid
              mt={3}
              key={index}
              item
              xs={3}
              style={{
                ...gridItemStyles,
                borderTop: `2px solid ${chartData.datasets[0].backgroundColor[index]}`,
                backgroundColor: 'black',
                padding: '10px',
              }}
            >
              <Box>
                <Typography textAlign={'center'} fontSize={10} lineHeight={1.2} variant="h6">
                  {item.label}
                </Typography>
                <Typography color={chartData.datasets[0].backgroundColor[index]} textAlign={'center'} variant="h6">
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  )
}

export default MembershipsCard
