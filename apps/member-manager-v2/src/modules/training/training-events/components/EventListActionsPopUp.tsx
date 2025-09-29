import React, { useState } from 'react'
import Button from '@mui/material/Button'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ActionsMenu from './EventListActionsMenu'
import PostModal from './EventModalPostWebsite'
import EmailModal from './EventModalEmailDeq'
import { Box } from '@mui/material'

export default function PositionedMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [postModalIsOpen, setPostModalIsOpen] = useState(false)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  return (
    <Box>
      <EmailModal 
        open={open} 
        modalIsOpen={modalIsOpen} 
        setModalIsOpen={setModalIsOpen}/>
      <PostModal 
        open={open}
        setPostModalIsOpen={setPostModalIsOpen} 
        postModalIsOpen={postModalIsOpen}/>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        fullWidth
      >
        <MoreVertIcon />
      </Button>
      <ActionsMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        open={open}
        setModalIsOpen={setModalIsOpen}
        setPostModalIsOpen={setPostModalIsOpen}
      />
    </Box >
  )
}
