import React from 'react'
import { Card, Box, Typography, Avatar, Tooltip, Grid } from '@mui/material'
import { Loading, useGetList, useGetMany, useRedirect } from 'react-admin'
import EmployeeIcon from '@mui/icons-material/Engineering'



const StaffCard = () => {
  const redirect = useRedirect()
  const { data: staffs } = useGetList('staff', {
    meta: {
      populate: true,
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  const staffIds = staffs?.map((staff) => staff.contact.id)

  const { data: contacts, isLoading: isLoadingContacts } = useGetMany('contacts', {
    ids: staffIds,
    meta: {
      raw: true,
    }
  })

  return isLoadingContacts ? (
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
        position: 'relative',
        mb: 2,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: '15px',
        backgroundColor: '#2C3238', // Darker background color
        color: '#ffffff', // Text color
      }}
    >
      <Typography
        variant='h6'
        fontSize={20}
        sx={{
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
          justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >
        {staffs?.length}
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: '8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <EmployeeIcon sx={{ fontSize: 30, marginRight: '8px' }} />
        <Typography variant='h5'>Staff</Typography>
      </Box>
      <Grid container spacing={1} maxWidth={'90%'} justifyContent={'center'} overflow={'scroll'} mt={5}>
        {contacts?.map((staff, index) => (
          <Grid key={index} item lg={2.3} xs={3} sm={2} md={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                my: 1,
              }}
            >
              <Tooltip title={`${staff?.first} ${staff?.last}`}>
                <Avatar
                  onClick={() => redirect(`/contacts/${staff.id}/show`)}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 1,
                    transition: 'transform 0.3s ease-in-out',
                    border: '2px solid #cccccc',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    }
                  }}
                  src={`${import.meta.env.VITE_API_ENDPOINT}${Array.isArray(staff?.avatar) ? staff?.avatar[0]?.url : staff?.avatar?.url}`}
                />
              </Tooltip>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default StaffCard
