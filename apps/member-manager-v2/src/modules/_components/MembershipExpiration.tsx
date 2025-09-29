import React from 'react'
import getExpirationDate from '../_helpers/getExpirationDate'
import { Typography } from '@mui/material'
import getExpiryBackground from '../_helpers/getExpiryBackground'


interface MembershipExpirationProps {
  lastPayment: string
  previousPayment: string
  format?: string
  fontSize?: string
}

const MembershipExpiration = ({
  lastPayment,
  previousPayment,
  format = 'MM/DD/YYYY',
  fontSize
}: MembershipExpirationProps) => {
  const expirationDate = getExpirationDate(previousPayment, lastPayment)
  const backgroundColor = getExpiryBackground(expirationDate)
  
  return (
    <Typography variant='h6'
      sx={{ 
        backgroundColor, 
        color: '#555', 
        padding: '5px 15px', 
        fontWeight: 900, 
        letterSpacing: 1, 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: fontSize ? fontSize : undefined
      }}>
      <span>Expiration: </span>
      <span>{ (lastPayment || previousPayment) ? (
        expirationDate.format(format).replace('Invalid Date', 'N/A')
      ) : (
        'None'
      )}</span>
    </Typography>
  )
}

export default MembershipExpiration
