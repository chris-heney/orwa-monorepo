import React from 'react'
import { SxProps, Typography } from '@mui/material'
import { RaRecord, useRecordContext } from 'react-admin'


interface ContactTitleProps {
  sx?: SxProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
}

const ContactTitle = ({
  sx,
  variant
}: ContactTitleProps = {
  variant: 'body2'
}) => {
  const record = useRecordContext<RaRecord>()
  return <Typography variant={variant || 'body2'} sx={sx}>{record.title}</Typography>
}

export default ContactTitle