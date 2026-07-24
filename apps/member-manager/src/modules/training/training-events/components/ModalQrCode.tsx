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
          border: '2px solid',
          borderColor: 'divider',
          boxShadow: 24,
          p: 1,
        }}
      >
        <Button
          sx={{ color: 'common.white', position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer', zIndex: 1 }}
          onClick={() => handleQrClose()}
        >
          X
        </Button>
        <CustomHeader title={qrTitle} sx={{ textAlign: 'center' }} />
        <Box my={5} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={1}>
          <Typography color="text.primary" fontSize={12} mb={1}>Click to Download</Typography>
          {/* Keep a light well so the QR remains scannable/downloadable */}
          <Box sx={{ bgcolor: 'common.white', p: 2, borderRadius: 1, lineHeight: 0 }}>
            <QRFieldComponent border={true} download={true} trainsitions={false} size={'70%'} handleQrToggle={handleQrToggle} minutes={240} />
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default ModalQrCode
