import React from 'react'
import { SxProps, Typography } from '@mui/material'
import { RaRecord, useRecordContext } from 'react-admin'


interface ContacLastNameProps {
  sx?: SxProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
}

const ContactLastName = ({sx, variant}: ContacLastNameProps) => {
  const record = useRecordContext<RaRecord>()
  return <Typography variant={variant || 'h5'} sx={sx}>{record.last}</Typography>
}

export default ContactLastName