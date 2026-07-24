import React from 'react'
import { Box, Card, Divider, Theme, useMediaQuery } from '@mui/material'
import { SimpleShowLayout, useRecordContext } from 'react-admin'
import {
  ContactAvatar,
  ContactEmail,
  ContactFullName,
  ContactPhone,
  ContactTitle,
} from '../fields'
import ContactVcard from '../fields/ContactVcard'
import ContactSms from '../fields/ContactSms'
import Badges from '../badges/Badges'

interface StaffCardProps {
  source?: string
  link?: boolean
  instructorLink?: boolean
  contactLink?: boolean
}
const ContactCard = ({ contactLink = false, link = false, instructorLink = false }: StaffCardProps) => {
  const staff = useRecordContext()
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Card
      title="Staff"
      sx={{
        flexGrow: 1,
        height: '100%',
        width: '100%',
        ml: ['auto', 0],
        mr: 'auto',
        py: '1rem',
        position: 'relative' // Set position to relative
      }}
    >
      <SimpleShowLayout>
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.5rem',
            alignItems: 'center'
          }}
        >
          <Badges/>
          <ContactAvatar personId={staff.id} contactLink={contactLink} instructorLink={instructorLink} link={link} />
          <Divider sx={{ my: '1rem', width: '100%' }} />
          <ContactFullName contactLink={contactLink} personId={staff.id} link={link} instructorLink={instructorLink} />
          <ContactTitle />
          {isSmall ? (
            <Box
              sx={{
                display: 'flex',
                textAlign: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
                pt: '0.5rem',
                width: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              <ContactVcard />
              <ContactEmail link icon />
              <ContactSms />
              <ContactPhone link icon />
            </Box>
          ) : (
            <>
              <ContactEmail link />
              <ContactPhone link />
            </>
          )}
        </Box>
      </SimpleShowLayout>
    </Card>
  )
}

export default ContactCard
