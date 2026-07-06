import React from 'react'
import { Button, SxProps, Typography } from '@mui/material'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import { Link, RaRecord, useRecordContext } from 'react-admin'


interface ContactEmailProps {
  sx?: SxProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
  link?: boolean
  icon?: boolean
}

const ContactEmail = ({
  sx,
  variant,
  link,
  icon
}: ContactEmailProps = {
  link: false,
  icon: false
}) => {
  const record = useRecordContext<RaRecord>()
  return record.email ? (icon
    ? 
    <Button onClick={() => { window.location.href = `mailto:${record.email}` }}>
      <AlternateEmailIcon sx={{ fontSize: '1.865rem', ...sx }} />
    </Button>
    : <Typography variant={variant || 'body1'} sx={sx}>
      { link 
        ? <Link to={`mailto:${record.email}`}>{record.email}</Link>
        : record.email
      }
    </Typography>
  ) : <></>
}

export default ContactEmail