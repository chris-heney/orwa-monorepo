import React, { useState } from 'react'
import { Box, Button, Card, IconButton, Modal, Tooltip, Typography } from '@mui/material'
import PublicKeyTokenIcon from '@mui/icons-material/Token'
import RefreshIcon from '@mui/icons-material/Refresh'
import { RaRecord, useUpdate } from 'react-admin'

interface StatWidgetProps {
  heading: string
  subheading: string
  token: RaRecord
}

const generatePublicKeyToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const PublicKeyTokenWidget = ({ heading, subheading, token }: StatWidgetProps) => {
  const [update] = useUpdate()
  const [openModal, setOpenModal] = useState(false)

  const regeneratePublicKeyToken = () => {
    const tokenData = {
      public_key: generatePublicKeyToken()
    }
    update('grant-scoring-tokens', { id: token.id, data: tokenData, previousData: token })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://orwa.org/grant-administration/?key=${subheading}`)
  }

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handleGenerateToken = () => {
    regeneratePublicKeyToken()
    handleCloseModal()
  }

  return (
    <>
      <Card
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : 'linear-gradient(to right, #ddd , #eee)',
          justifyContent: 'space-between',
          padding: 1,
          borderRadius: '0px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          color: 'text.primary',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton sx={{ color: '#3498db', p: 0, mb: -3 }} onClick={handleOpenModal}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: '#3498db',
              borderRadius: '50%',
              marginRight: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PublicKeyTokenIcon />
          </Box>
          <Box sx={{ flex: 1, color: '#3498db' }} >
            <Typography variant='h6' sx={{ mb: -1 }}>
              {heading}
            </Typography>
            <Tooltip title="Click to Copy">
              <Typography variant='subtitle2' onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
                {subheading}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Card>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px'
        }}>
          <Typography variant='h6' textAlign={'center'}>Generate New Token</Typography>
          <Typography variant='body1' sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
            Are you sure you want to generate a new token? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='contained' color='secondary' onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' onClick={handleGenerateToken}>
              Generate Token
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default PublicKeyTokenWidget