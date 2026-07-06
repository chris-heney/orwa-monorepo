import React from 'react'
import { SxProps, Typography } from '@mui/material'
import { Identifier, Link, RaRecord, useRecordContext } from 'react-admin'


interface ContactNameProps {
  sx?: SxProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
  personId?: Identifier
  link?: boolean
  instructorLink?: boolean
  contactLink?: boolean
}

const ContactFullName = ({ 
  sx,
  variant,
  personId = 0,
  link = false,
  instructorLink= false,
  contactLink = false
}: ContactNameProps ) => {
  const record = useRecordContext<RaRecord>()
  if (record.first === null || record.last === null) {
    return null
  }
  return (
    link ? <Link to={`/staff/${personId}/show`}><Typography variant={variant || 'h5'} sx={sx}>{record.first + ' ' + record.last}</Typography></Link>
      : instructorLink ? <Link to={`/training-instructors/${personId}/show`}><Typography variant={variant || 'h5'} sx={sx}>{record.first + ' ' + record.last}</Typography></Link> 
        : contactLink ?  <Link to={`/contacts/${personId}/edit`}><Typography variant={variant || 'h5'} sx={sx}>{record.first + ' ' + record.last}</Typography></Link>  
          : <Typography variant={variant || 'h5'} sx={sx}>{record.first + ' ' + record.last}</Typography>
  )
}

export default ContactFullName