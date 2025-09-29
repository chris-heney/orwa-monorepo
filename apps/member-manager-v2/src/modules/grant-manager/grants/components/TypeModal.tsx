import * as React from 'react'
import Typography from '@mui/material/Typography'
import {  Create, SimpleForm, TextInput } from 'react-admin'
import Grid from '@mui/material/Grid'
import { Box, Button, } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

interface ModalContentProps {
  setIsTopicOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TypeModal: React.FC<ModalContentProps> = ({ setIsTopicOpen }) => {
 
  return (
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
    }}>

      <Button style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer' }} onClick={() => setIsTopicOpen(false)}>
        <ClearIcon />
      </Button>
      <Typography variant='h4' fontWeight={'bold'} textAlign={'center'}>New Grant Type</Typography>
      <Typography>
        <Create resource="grant-types" redirect={false} >
          <SimpleForm >
            <Grid sx={{ justifyContent: 'center' }} container spacing={2}>
              <Grid xs={12} sm={12} md={12} lg={12}>
                <TextInput fullWidth  source="name" label="Name" />
              </Grid>
              <Grid xs={12} sm={12} md={12}lg={12}>
                <TextInput  fullWidth source="description" label="Description" multiline rows={10}/>
              </Grid>            
            </Grid>
          </SimpleForm>
        </Create>
      </Typography>
    </Box>
  )
}

export default TypeModal
