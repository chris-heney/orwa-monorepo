import React from 'react'
import { SxProps, Typography } from '@mui/material'
import { RaRecord, useRecordContext } from 'react-admin'


interface ContactFirstNameProps {
  sx?: SxProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
}

const ContactFirstName = ({sx, variant}: ContactFirstNameProps = {} ) => {
  const record = useRecordContext<RaRecord>()
  if (record.first === undefined) {
    // You can choose to return null or another default value
    return null
  }
  return <Typography variant={variant || 'h5'} sx={sx}>{record.first}</Typography>
}

export default ContactFirstName