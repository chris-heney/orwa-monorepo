import React from 'react'
import { Box, Button, Fade, Typography } from '@mui/material'
import CustomHeader from '../../../_components/CustomHeader' 
import { QRFieldProps } from './ScheduleShow' 

interface QrModalProps {
  QRFieldComponent: React.ComponentType<QRFieldProps>
  handleQrClose: () => void
  handleQrToggle: () => void
  isQrCodeOpen: boolean
  qrTitle: string
}
const ModalQrCode = ({ qrTitle, QRFieldComponent, isQrCodeOpen, handleQrClose, handleQrToggle }: QrModalProps) => {
  return (
    <Fade in={isQrCodeOpen}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          bgcolor: 'background.paper',
          border: '2px solid black',
          boxShadow: 24,
          p: 1,
        }}
      >
        <Button
          style={{ color: 'white', position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer' }}
          onClick={() => handleQrClose()}
        >
          X
        </Button>
        <CustomHeader title={qrTitle} sx={{ textAlign: 'center' }} />
        <Box my={5} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={1}>
          <Typography color={'black'} fontSize={12}>Click to Download</Typography>
          <QRFieldComponent border={true} download={true} trainsitions={false} size={'70%'} handleQrToggle={handleQrToggle} minutes={240} />
        </Box>
      </Box>
    </Fade>
  )
}

export default ModalQrCode
