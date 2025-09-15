import { Box } from '@mui/material'
import React from 'react'
import {Pagination} from 'react-admin'

const CustomPagination = () => {
  return (
    <Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}><Pagination rowsPerPageOptions={[10, 25, 50, 100]} sx={{ flexDirection: 'row-reverse' }} /></Box>
  )
}

export default CustomPagination
