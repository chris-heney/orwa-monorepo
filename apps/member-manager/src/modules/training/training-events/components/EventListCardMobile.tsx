import React from 'react'
import { Avatar, Box, Button, Card, Grid, Typography } from '@mui/material'
import { SimpleShowLayout, useGetList, useGetOne, useRecordContext } from 'react-admin'
import TrainingClassActionsButton from './EventListActionsPopUp'
import { YearMonthDay } from '../../../../helpers/Data'
import DirectionsIcon from '@mui/icons-material/Directions'

const EventListCardMobile = () => {

  const record = useRecordContext()

  const startDate = new Date(record.start)
  const endDate = new Date(record.end)
  const formattedStartDate = startDate.toLocaleString('en-US', YearMonthDay)
  const formattedEndDate = endDate.toLocaleString('en-US', YearMonthDay)

  const { data, isLoading, error } = record.instructor
    ? useGetList('training-instructors', {
      meta: {
        raw: true,
      },
      pagination: { page: 1, perPage: 1000 },
      filter: { id: record.instructor },
    })
    : { data: undefined, isLoading: false, error: null }
    
  const { data : contact } = useGetOne('contacts', {id : data ? data[0].instructor.id : ''})

  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>  
  return (
    <Card
      title="Staff"
      sx={{
        flexGrow: 1,
        width: '100%',
        ml: ['auto', 0],
        mr: 'auto',
        py: '1rem',
        position: 'relative'
      }}
    >
      <SimpleShowLayout>
        <Box>
          <Grid container spacing={2} sx={{ position: 'absolute', top: 0, right: 0, padding: '8px', alignItems: 'center' }}>
            {/* Place button far left */}
            <Grid item xs={2}>
              <TrainingClassActionsButton />
            </Grid>

            {/* Centered text */}
            <Grid item xs={7} textAlign="center">
              <Typography variant="h6" fontWeight="bold" fontSize={16}>
                {record.training_type}
              </Typography>
            </Grid>

            {/* Status far right */}
            <Grid item xs={3} >
              <Typography
                fontWeight={'bold'}
                variant={'h6'}
                color='white'
                textAlign={'center'}
                sx={{
                  backgroundColor: '#2196f3',
                  textTransform: 'uppercase',
                  borderBottomLeftRadius: '5px',
                  fontSize: '12px',
                  py: 0.5,
                  px: 1,
                }}
              >
                {record.status}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Typography
          mt={3}
          textAlign={'center'}
          variant="h6"
          fontSize={12}
          fontWeight="bold"
          sx={{
            whiteSpace: 'pre-line',
            maxWidth: '100%',
            marginLeft: 'auto',
          }}
        >
          {formattedStartDate} - {formattedEndDate}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: data ? 'space-between' : 'flex-start', gap: '8px', minHeight: 30 }}>
          {data ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar src={contact ? contact.avatar[0].url : ''} />
                <Typography>{contact ? contact.first : ' '}</Typography>
                <Typography>{contact ? contact.last: ' '}</Typography>
              </Box>
              <Box>
                <Button
                  sx={{ justifyContent: 'center', height: 20 }}
                  variant='contained'
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${record.address.street}, ${record.address.city}, ${record.address.state} ${record.address.zip}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DirectionsIcon sx={{ height: 20 }} />
                </Button>
              </Box>
            </>
          ) : (
            <Button
              sx={{ justifyContent: 'center', height: 20 }}
              variant='contained'
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${record.address.street}, ${record.address.city}, ${record.address.state} ${record.address.zip}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DirectionsIcon sx={{ height: 20 }} />
            </Button>
          )}
        </Box>
      </SimpleShowLayout>
    </Card>
  )
}

export default EventListCardMobile
