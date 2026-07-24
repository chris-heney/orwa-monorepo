import React, { useRef, useEffect } from 'react'
import { Card, Box, Typography } from '@mui/material'
import WatersystemIcon from '@mui/icons-material/WaterDrop'
import { Loading, useGetList } from 'react-admin'
import { Bar } from 'react-chartjs-2'
import { Chart, ChartOptions, registerables } from 'chart.js/auto' // Import registerables for Chart.js 3.x
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types'

Chart.register(...registerables) // Register necessary components

const WaterSystemsCard = () => {
  const { data: watersystems, isLoading } = useGetList('watersystems', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  const activeWaterSystems = watersystems?.filter(system => system.active === true)
  const inactiveWaterSystems = watersystems?.filter(system => system.active === false)

  const chartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        label: 'Water Systems',
        backgroundColor: ['#4CAF50', '#FF5252'],
        data: [activeWaterSystems?.length || 0, inactiveWaterSystems?.length || 0],
      },
    ],
  }

  // Axis/legend colors must stay light — the card itself is a saturated blue
  // surface in both themes, so black chart chrome washes out.
  const chartChrome = 'rgba(255, 255, 255, 0.85)'
  const chartGrid = 'rgba(255, 255, 255, 0.25)'

  const chartOptions: ChartOptions<'bar'> = {
    scales: {
      x: {
        ticks: {
          color: chartChrome,
        },
        grid: {
          color: chartGrid,
        },
      },
      y: {
        beginAtZero: true,
        max: watersystems?.length || 0,
        ticks: {
          color: chartChrome,
        },
        grid: {
          color: chartGrid,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: chartChrome,
        },
      },
    },
  }


  // Use useRef to keep track of the chart instance
  const chartRef = useRef<ChartJSOrUndefined<'bar'>>()

  // Destroy the chart when the component unmounts
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [])

  return isLoading ? (
    <Loading />
  ) : (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#2b8de2',
        color: '#ffffff',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Typography
        variant='h6'
        fontSize={12}
        sx={{
          position: 'absolute',
          top: -5,
          right: -6,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : '#fff',
          padding: '8px',
          borderRadius: '50%',
          color: '#2b8de2',
          fontWeight: 'bold',
        }}
      >
        {watersystems?.length || 0}
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          top: -5,
          left: -5,
          margin: '8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <WatersystemIcon sx={{ fontSize: 30 }} />
        <Typography variant='h5'>Water Systems</Typography>
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          marginTop: '30px',
        }}
      >
        <Typography variant='h2' fontWeight={'bold'} color='#4CAF50'>
          {activeWaterSystems?.length}
        </Typography>
        <Typography variant='h6'>Active</Typography>

        <Typography variant='h2' fontWeight={'bold'} color='#FF5252'>
          {inactiveWaterSystems?.length}
        </Typography>
        <Typography variant='h6'>Inactive</Typography>
      </Box>
      <Bar data={chartData} options={chartOptions} ref={chartRef} />
    </Card>
  )
}

export default WaterSystemsCard
