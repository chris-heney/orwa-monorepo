import React from 'react'
import { Box, Card, Divider, Theme, useMediaQuery } from '@mui/material'
import { ReferenceField, SimpleShowLayout, useRecordContext } from 'react-admin'
import { ContactAvatar, ContactEmail, ContactFullName, ContactPhone, ContactTitle } from '../../contacts/fields'
import ContactVcard from '../../contacts/fields/ContactVcard'
import ContactSms from '../../contacts/fields/ContactSms'
import Badges from '../../contacts/badges/Badges'
interface StaffCardProps {
  source?: string
  link?: boolean
  instructorLink?: boolean
}
const StaffCard = ({source = 'contact' , link = false, instructorLink = false} : StaffCardProps) => {

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
      }}
    >
      <SimpleShowLayout>
        <ReferenceField reference="contacts" source={source} label="" link={false}>
          <Box sx={{
            textAlign: 'center', flex: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.5rem',
              alignItems: 'center'
            }
          }}>   
            <ContactAvatar personId={staff.id} instructorLink={instructorLink} link={link} />
            <Divider sx={{ my: '1rem', width: '100%' }} />
            <Badges/> 
            <ContactFullName personId={staff.id} link={link} instructorLink={instructorLink} />
            <ContactTitle />
            {isSmall
              ? <Box sx={{
                display: 'flex',
                textAlign: 'center',
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                pt: '0.5rem',
                width: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
                <ContactVcard />
                <ContactEmail link icon />
                <ContactSms />
                <ContactPhone link icon />
              </Box>
              : <>
                <ContactEmail link />
                <ContactPhone link />
              </>
            }
          </Box>
        </ReferenceField>
      </SimpleShowLayout>
    </Card>
  )
}

export default StaffCard