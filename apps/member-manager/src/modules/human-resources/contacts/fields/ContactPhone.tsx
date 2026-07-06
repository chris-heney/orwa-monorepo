import React from 'react'
import { Button, SxProps, Typography } from '@mui/material'
import { Link, RaRecord, useRecordContext } from 'react-admin'
import PhoneIcon from '@mui/icons-material/Phone'


interface ContactPhoneProps {
  sx?: SxProps
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
  link?: boolean
  icon?: boolean
}

const ContactPhone = ({
  sx,
  variant,
  link,
  icon
}: ContactPhoneProps = {
  link: false,
  icon: false
}) => {
  const record = useRecordContext<RaRecord>()

  return record.phone ?  (icon
    ? <Button onClick={() => {
      window.location.href = `tel:${record.phone.replace(/\D/g, '') }`
    }}>
      <PhoneIcon sx={{ fontSize: '1.865rem', ...sx }} />
    </Button>
    : <Typography variant={variant || 'body1' } sx={sx}>
      {link
        ? <Link to={`tel:${record.phone.replace(/\D/g, '') }`}>{record.phone}</Link>
        : record.phone
      }
    </Typography>
  ) : <></>
}

export default ContactPhone