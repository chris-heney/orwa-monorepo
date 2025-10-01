import React, { useState } from 'react'
import {Card, IconButton, Dialog, DialogContent, Button, Box, Typography, Grid, Chip, Tooltip, TextField} from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import BadgeGrid from './BadgeGrid'
import ColorWheel  from '../../../_components/ColorWheel'
import { Link, useDataProvider, useNotify } from 'react-admin'
import { Input } from '@mui/material'
import CustomBooleanInput from '../../../_components/CustomBooleanInput'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'
import uploadService from 'src/services/uploadService'

const BadgeList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [color, setColor] = useState('#FF0000')
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [invert, setInvert] = useState(false)
  const dataProvider = useDataProvider()
  const notify = useNotify()


  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleCreateButtonClick = () => {
    handleOpenModal()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (e: any) => {
    const selectedImage = e.target.files[0]
    setIcon(URL.createObjectURL(selectedImage)) 
    setImage(selectedImage)
  }
  const handleTitleChange = (e  :  React.ChangeEvent<HTMLInputElement>) => {
    // Handle text input change logic here
    const newTitle = e.target.value
    setTitle(newTitle)
  }


  const CreateBadge = async () => {

    if (!image) {
      notify('Please upload an image', {type: 'error'})
      return
    }

    const uploadResponse = await uploadService.uploadFile(image, true);


    try {
      await dataProvider.create('contact-badges', {
        data: {
          title: title,
          color_code: color,
          icon: uploadResponse,
          ivert: invert
        },
      })
      // Reset state variables
      setTitle('')
      setIcon('')
      setImage(null)
      setColor('#FF0000')

      // Close the modal
      handleCloseModal()
      notify('Badge created successfully', {type: 'success'})

    } catch (createBadgeError) {
      notify('Error creating new Badge', {type: 'error'})
      console.error('Error creating new Badge:', createBadgeError)
    }
  }
  return (
    <Card sx={{ maxWidth: 500, borderRadius: 0, my: 1 }}>
      <CustomSecondaryHeader title='Badges' />
      <IconButton sx={{ textAlign: 'center' }} onClick={handleCreateButtonClick}>
        <AddIcon />
      </IconButton>

      {/* Badges */}
      <BadgeGrid />

      {/* Modal for Create */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ alignItems: 'center', width: '100%' }}>
          <Typography
            variant='h5'
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              p: 2,
              color: 'white',
              backgroundColor: 'black',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              flexGrow: 1,

            }}
          >
            Create Badge
          </Typography>
        </Box>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link to='https://www.svgrepo.com/' target='_blank' rel='noopener noreferrer'>
              <Button variant='outlined' color='primary'>
                Find Icons
              </Button>
            </Link>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ColorWheel setColor={setColor} />
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant='filled'
                    label='Title'
                    type="text"
                    id="textInput"
                    value={title}
                    fullWidth
                    onChange={handleTitleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    type="file"
                    id="imageInput"
                    onChange={handleImageChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomBooleanInput
                    label='invert'
                    value={invert}
                    onChange={() => setInvert((prev) => !prev)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Tooltip title={title} arrow>
                    <Chip
                      label={<img src={icon} alt={title} height={24} style={{filter: invert ?  'invert(1)' : ''}}/>}
                      sx={{ padding: '0px', backgroundColor: color }}
                    />                 
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <Box sx={{ p: 2 }}>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button color="primary" onClick={CreateBadge}>
            Save
          </Button>
        </Box>
      </Dialog>
    </Card>
  )
}

export default BadgeList
