import React from 'react'

import { Show, useShowController } from 'react-admin'
import { Box, Button } from '@mui/material'
import { usePDF, Resolution, Margin } from 'react-to-pdf'
import DownloadIcon from '@mui/icons-material/Download'
import TrainingCertificate from './components/TrainingCertificate'


const TainingLogShow = () => {  
  const { record } = useShowController()
  const { toPDF, targetRef } = usePDF({ filename: 'Training-Certificate.pdf', resolution : Resolution.HIGH, page:{margin : Margin.SMALL}})
  const eventName = 'training-events'
  if (typeof record === 'undefined' || !record) return null 
  return (
    <Show title='Training History' component={'div'}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: '768px', mx: 'auto', py: 3 }}>
        <Button variant="contained" color="success" onClick={() => toPDF()}>
          <DownloadIcon />
          Download Certificate
        </Button>
      </Box>
      <TrainingCertificate record={record} targetRef={targetRef} eventName={eventName} />
    </Show>
  )
}

export default TainingLogShow
