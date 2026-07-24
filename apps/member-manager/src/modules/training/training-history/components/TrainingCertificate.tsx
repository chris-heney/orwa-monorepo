import React from 'react'

import LogoSrc from '../../../../assets/logo.png'
import { DateField, RaRecord, ReferenceField, TextField } from 'react-admin'
import { Box, Typography } from '@mui/material'



const boxStyle = { my: 3, flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' } }

export default function TrainingCertificate({
  record,
  targetRef,
}: {
  'record': RaRecord
  targetRef: React.RefObject<HTMLDivElement>
  'eventName': string
}) {
  return (
    <Box sx={{
      ...boxStyle,
      border: '1px solid',
      borderColor: 'divider',
      maxWidth: '768px',
      mx: 'auto',
      boxShadow: '0 0 15px rgba(0,0,0,0.4)',
      borderRadius: '5px',
      // Printable certificate stays light; dark mode uses paper for contrast.
      bgcolor: (theme) =>
        theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F9F9F9',
      color: 'text.primary',
      textAlign: 'center',
    }}>
      <Box ref={targetRef}>
        <img src={LogoSrc} alt="logo" width={130} style={{ marginTop: 20 }} />
        <Typography variant={'h1'} fontSize={37} fontWeight={'bold'}>OPERATOR</Typography>
        <Typography fontSize={37} fontWeight={'bold'}>TRAINING CERTIFICATE</Typography>
        <Box style={{ width: '340px', textAlign: 'center', margin: 'auto' }}>
          <hr style={{ backgroundColor: 'blue', height: '5px', border: 'none' }} />
        </Box>
        <Typography variant='h5' mt={3} fontWeight={'bold'}>AWARDED TO</Typography>
        <Box sx={{ color: 'text.primary' }}>
          {<ReferenceField source="contact" reference="contacts"
            link={false}
          >
            <TextField source="first" fontSize={16} />
            {' '}
            <TextField source="last" fontSize={16} />
          </ReferenceField>}
        </Box>
        <Box sx={boxStyle}>
          <Typography variant='h4' sx={{ fontSize: 20, fontWeight: 'bold', mb: 0, textTransform: 'uppercase' }}>License</Typography>
          <Typography>
            {'#'}
            <ReferenceField
              source="contact"
              reference="contacts"
              link={false}
            >
              <TextField source="license" />
            </ReferenceField>
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant='h5' fontWeight={'bold'} >TRAINING TYPE</Typography>
          <Typography  > <ReferenceField source="event" reference="training-events"
            link={false}
          >
            <TextField source="program" />
          </ReferenceField></Typography>
          <Typography><ReferenceField source="event" reference="training-events"
            link={false}
          >
            <TextField fontSize={15} source="training_type" />
          </ReferenceField></Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant='h5' fontWeight={'bold'}>DATE(S)</Typography>
          <ReferenceField source="event" reference="training-events"
            link={false}
          >
            <DateField source="start" />
          </ReferenceField>
          {' - '}
          <ReferenceField source="event" reference="training-events"
            link={false}
          >
            <DateField source="end" />
          </ReferenceField>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant='h5' fontWeight={'bold'}>HOURS RECIEVED</Typography>
          <Typography >
            {record.type === 'Block' ? (
              <Typography>4</Typography>)
              : <Typography>1</Typography>
             
            }</Typography>
        </Box>
        <Box style={{ width: '340px', textAlign: 'center', margin: 'auto' }}>
          <hr style={{ backgroundColor: 'blue', height: '5px', border: 'none' }} />
        </Box>
        <Box sx={boxStyle}>
          <Typography variant='h6' fontWeight={'bold'}>APPROVED BY</Typography>
          <Typography >Kelley Brown</Typography>
        </Box>
      </Box>
    </Box>
  )
}