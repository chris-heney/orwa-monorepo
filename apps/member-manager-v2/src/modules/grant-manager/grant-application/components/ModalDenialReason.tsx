import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Create, SimpleForm, TextInput, useCreate, useNotify } from 'react-admin'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import { FieldValues } from 'react-hook-form'
import ColorWheel, { ColorProps } from '../../../_components/ColorWheel'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'

interface ModalContentProps {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalDenialReason = ({ setIsModalOpen }: ModalContentProps) => {
  
  const [color, setColor] = React.useState<ColorProps | undefined>(undefined)
  const [create] = useCreate()
  const notify = useNotify()
  const postSave = (data: FieldValues) => {
    create('grant-denial-reasons', {
      data: {
        ...data,
        color: color?.hex
      }
    })

    notify('Topic Was Created', { type: 'success' })
    setIsModalOpen(false)
  }

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
    }}>

      <CustomSecondaryHeader sx={{textAlign:'center'}} title="New Denial Reason" />
      <Typography>
        <Create title={' '} sx={{ '& .css-1a69w1n-MuiStack-root' :{
          alignItems: 'center',
        }}} resource="grant-denial-reasons" redirect={false}>
          <SimpleForm onSubmit={postSave} >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextInput source="name" label="Name" fullWidth helperText={false} />
              </Grid>
              <Grid item xs={6}>
                <TextInput source="description" label="Description" fullWidth helperText={false} />
              </Grid>          
            </Grid>
            <Box sx={{ marginTop: '1rem' }}>
              <ColorWheel setColor={setColor} />
            </Box>
          </SimpleForm>
        </Create>
      </Typography>
    </Box>
  )
}
export default ModalDenialReason
