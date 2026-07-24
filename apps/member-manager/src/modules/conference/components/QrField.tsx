import { Box, Modal } from '@mui/material'
import QRCode from 'react-qr-code'
import CustomSecondaryHeader from '../../_components/CustomSecondaryHeader'
import React from 'react'

interface QRFieldProps {
    first_name: string
    last_name: string
    organization: string
    type: string
    title: string
    email: string
    phone: string
    license_number: string
    passport_id: string
    wp_uid: string
    wp_eid: number
    wp_seid: string
  
  }
  
const QRField = ({ first_name,
  last_name,
  organization,
  type,
  title,
  email,
  phone,
  license_number,
  passport_id,
  wp_uid,
  wp_eid,
  wp_seid, }: QRFieldProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const url = `https://orwa.org/digital-badge/?first_name=${first_name}&last_name=${last_name}&organization=${organization}&type=${type}&title=${title}&email=${email}&phone=${phone}&license_number=${license_number}&passport_id=${passport_id}&wp_uid=${wp_uid}&wp_eid=${wp_eid}&wp_seid=${wp_seid}`
  // console.log(url)
  return (
    <Box>
      <QRCode
        style={{
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onClick={() => isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true)}
        size={20}
        viewBox={'0 0 256 256'}
        value={url}
      />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            boxShadow: 24,
          }}
        >
          <CustomSecondaryHeader title={`${first_name} ${last_name}`} />
          <QRCode
            size={300}
            value={url}
          />
        </Box>
      </Modal>
    </Box>

  )
}

export default QRField