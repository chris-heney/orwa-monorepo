import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Create, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput, useCreate, useNotify } from 'react-admin'
import Grid from '@mui/material/Grid'
import { Box, Button } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { TrainingInstructorAutocompleteInput } from '../../../_components/autocompletes/TrainingInstructorAutocomplete' 
import { FieldValues } from 'react-hook-form'
import { TopicCategories } from '../../../../helpers/Data'

interface ModalContentProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalTopic: React.FC<ModalContentProps> = ({ setIsModalOpen }) => {
  const [create] = useCreate()
  const notify = useNotify()
  const postSave = (data: FieldValues) => {
    create('training-topics', { data })
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
      border: '2px solid',
      borderColor: 'divider',
      boxShadow: 24,
      p: 4,
    }}>

      <Button style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>
        <ClearIcon />
      </Button>
      <Typography variant='h4' fontWeight={'bold'} textAlign={'center'}>New Training Topic</Typography>
      <Typography>
        <Create resource="training-topics" redirect={false}>
          <SimpleForm resource="training-topics" onSubmit={postSave} >
            <Grid container spacing={2}>
              <Grid item xs={6} >
                <TextInput source="name" label="Name" fullWidth helperText={false} />
              </Grid>
              <Grid item xs={6} >
                <SelectInput choices={TopicCategories} source="category" label="Category" fullWidth helperText={false} />
              </Grid>
              <Grid item xs={6} >
                <NumberInput source="default_time" label="Minutes" defaultValue={60} fullWidth helperText={false} />
              </Grid>
              <Grid item xs={6} >
                <ReferenceInput
                  reference="training-instructors"
                  source="training_instructors"
                  helperText={false}
                >
                  <TrainingInstructorAutocompleteInput source={'training_instructors'} />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} >
                <TextInput source="summary" label="Summary" fullWidth multiline rows={5} helperText={false} />
              </Grid>
            </Grid>
          </SimpleForm>
        </Create>
      </Typography>
    </Box>
  )
}
export default ModalTopic
