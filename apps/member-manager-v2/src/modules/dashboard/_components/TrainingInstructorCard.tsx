import React from 'react'
import {Card, Box, Typography, Avatar, Tooltip, Grid} from "@mui/material"
import { Loading, useGetList, useGetMany, useRedirect } from 'react-admin'
import InstructorIcon from '@mui/icons-material/School'

const InstructorsCard = () => {

  const redirect = useRedirect()
  const { data: instructors } = useGetList('training-instructors', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 1000 },
  })

  console.log(instructors)
  const contactIds = instructors?.map((instructor) => instructor.id)

  console.log(contactIds)

  const { data: contacts, isLoading: isLoadingContacts } = useGetMany('contacts', {
    ids: contactIds,
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
        height: '100%',
        width: '100%',
        position: 'relative',
        mb: 2,
        boxShadow: 3,
        borderRadius: '15px',
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Typography
        variant="h6"
        fontSize={20}
        sx={{
          position: 'absolute',
          top: -10,
          right: -3,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
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
        {instructors?.length}
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
        <InstructorIcon sx={{ fontSize: 30, marginRight: '8px' }} />
        <Typography variant="h5">Training Instructors</Typography>
      </Box>

      <Grid container spacing={1} maxWidth={'90%'} overflow={'scroll'} mt={6}>
        {contacts?.map((contact, index) => (
          console.log(contact),
          <Grid key={index} lg={2.3} xs={3} sm={2} md={3}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                my: 1,
              }}
            >
              <Tooltip title={`${contact?.first} ${contact?.last}`}>
                <Avatar
                  onClick={() => redirect(`/contacts/${contact.id}/show`)}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    transition: 'transform 0.3s ease-in-out',
                    border: '2px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    }
                  }}
                  src={`${import.meta.env.VITE_API_ENDPOINT}${Array.isArray(contact?.avatar) ? contact?.avatar[0]?.url : contact?.avatar?.url}`}
                />
              </Tooltip>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default InstructorsCard
