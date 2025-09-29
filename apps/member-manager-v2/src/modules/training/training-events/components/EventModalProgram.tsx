import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Create, SimpleForm, TextInput, useCreate, useNotify } from 'react-admin'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import { FieldValues } from 'react-hook-form'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'

interface ModalContentProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalProgram: React.FC<ModalContentProps> = ({ setIsModalOpen }) => {
  const [create] = useCreate()
  const notify = useNotify()
  const postSave = (data: FieldValues) => {
    create('programs', { data })
    notify(`Program ${data.name} Was Created `, { type: 'success' })
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
      <CustomSecondaryHeader title={'New Program Billed'} />
      <Typography>
        <Create resource="programs" component={'div'} redirect={false}>
          <SimpleForm resource="programs" onSubmit={postSave} >
            <Grid container spacing={2}>
              <Grid xs={6}>
                <TextInput source="name" label="Name" fullWidth helperText={false} />
              </Grid>
              <Grid xs={6}>
                <TextInput source="descriptoon" label="Description"  fullWidth helperText={false} />
              </Grid>
            </Grid>
          </SimpleForm>
        </Create>
      </Typography>
    </Box>
  )
}
export default ModalProgram
