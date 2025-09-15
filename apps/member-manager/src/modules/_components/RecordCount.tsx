import { Theme, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import {  useListContext } from 'react-admin'

const RecordCount = () => {
  const {total} = useListContext()
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
  return  (
    <Typography fontSize={isSmall ? '12px' : undefined} color={'white'} variant='button'>{total} Records</Typography>
  )
}

export default RecordCount
