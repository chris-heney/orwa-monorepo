import React from 'react'
import { Card, Box, Typography } from '@mui/material'
import { Loading, useGetList } from 'react-admin'
import AssociateIcon from '@mui/icons-material/StoreMallDirectory'

const AssociatesCard = () => {
  const { data: associates, isLoading } = useGetList('associates', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })
  const activeAssociates = associates?.filter(associate => associate.active === true)

  // Filter inactive water associates
  const inactiveAssociates = associates?.filter(associate => associate.active === false)

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
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : '#f5f5f5',
        color: 'text.primary',
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
              ? theme.palette.action.selected
              : '#f0f0f0',
          color: 'text.primary',
          fontWeight: 'bold',
          padding: '8px',
          borderRadius: '50%',
        }}
      >
        {associates?.length}
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
        <AssociateIcon sx={{ fontSize: 30 }} />
        <Typography variant='h5'>Associates</Typography>
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          marginTop: '30px',
        }}
      >
        <Typography variant='h2' fontWeight={'bold'} color='green'>
          {activeAssociates?.length}
        </Typography>
        <Typography variant='h6'>Active</Typography>

        <Typography variant='h2' fontWeight={'bold'} color='red'>
          {inactiveAssociates?.length}
        </Typography>
        <Typography variant='h6'>Inactive</Typography>
      </Box>
    </Card>
  )
}

export default AssociatesCard
