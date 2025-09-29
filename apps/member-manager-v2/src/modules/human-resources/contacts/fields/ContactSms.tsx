import React from 'react'
import { Button, SxProps } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import { RaRecord, useRecordContext } from 'react-admin'


interface ContactEmailProps {
  sx?: SxProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
  link?: boolean
  icon?: boolean
}

const ContactSms = ({
  sx,
}: ContactEmailProps = {
  link: false,
  icon: false
}) => {
  const record = useRecordContext<RaRecord>()

  return record.phone ? ( 
    <Button onClick={() => {
      window.location.href = `sms:${record.phone.replace(/\D/g, '') }`
    }}>
      <MailIcon sx={{ fontSize: '1.865rem', ...sx }} />
    </Button>
  ) : <></>
}

export default ContactSms