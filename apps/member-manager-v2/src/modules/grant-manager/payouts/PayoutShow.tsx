import React from 'react'
import { Identifier, Show, TextField } from 'react-admin'
import { Divider, Typography } from '@mui/material'

interface PayoutShowProps {
    id: Identifier
}
const PayoutShow = ({id}: PayoutShowProps) => {

  return (
    <Show component={'div'} title={' '} id={id} resource='grant-payouts'>
      <Typography variant='h6'>Payout Notes</Typography>
      <Divider sx={{mb : 2}} />
      <TextField variant='subtitle1' source='comments' /> 
    </Show>
  )
}

export default PayoutShow
