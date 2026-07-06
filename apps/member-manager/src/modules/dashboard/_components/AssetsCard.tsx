import React from 'react'
import { Card, Box, Typography, Tooltip, Grid, Avatar } from '@mui/material'
import { Loading, useGetList, useRedirect } from 'react-admin'
import InventoryIcon from '@mui/icons-material/Inventory'



const AssetsCard = () => {
  const redirect = useRedirect()
  const { data: assets, isLoading } = useGetList('assets', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  return isLoading ? (
    <Loading />
  ) : (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: '15px',
        backgroundColor: '#2C3238', // Darker background color
        color: '#ffffff', // Text color
        padding: '20px',
      }}
    >
      <Typography
        variant='h6'
        fontSize={20}
        sx={{
          justifyContent: 'center',
          position: 'absolute',
          top: -10,
          right: -3,
          backgroundColor: '#4C535A', // Darker gray background color
          padding: '10px',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
        }}
      >
        {assets?.length}
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: '8px',
          display: 'flex',
        }}
      >
        <InventoryIcon sx={{ fontSize: 30, marginRight: '8px' }} />
        <Typography variant='h5'>Assets Tracked</Typography>
      </Box>

      <Grid container spacing={2} maxWidth={'100%'} mt={2} overflow={'scroll'} >
        {assets?.map((asset, index) => (
          <Grid key={index} item lg={3} xs={4} sm={3} md={4}>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                my: 1,
              }}
            >
              <Tooltip title={`${asset?.name}`}>
                <Avatar
                  onClick={() => redirect(`/assets/${asset.id}/show`)}
                  style={{
                    width: 70,
                    height: 70,
                    transition: 'transform 0.3s ease-in-out',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    border: '2px solid #cccccc',
                    borderRadius: '15px',
                  }}
                  src={`${import.meta.env.VITE_API_ENDPOINT}${asset.images?.[0]?.url || ''}`}
                />
              </Tooltip>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default AssetsCard
