import React, { useContext } from 'react'
import {
  AutocompleteInput,
  Create,
  DatagridConfigurable,
  Edit,
  NumberField,
  NumberInput,
  RaRecord,
  ReferenceInput,
  SimpleForm,
  TextField,
  TextInput,
  useCreate,
  useNotify,
  useRemoveFromStore,
  useUpdate
} from 'react-admin'
import {
  Button,
  Card,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import { CurrencyOptions } from '../../../config/Settings'
import CustomSecondaryHeader from '../../_components/CustomSecondaryHeader'
import CustomToolBar from '../../_components/CustomToolbar'
import { ConferenceContext } from '../ConferenceContext'
import { createRecord } from '../../_helpers/createRecord'
import { updateRecord } from '../../_helpers/updateRecord'
import { customDatagridStyle, positionStickyComponent } from '../../../css'
import CustomPagination from '../../_components/CustomPagination'



// @TODO: Implement ConferenceExtraForm a inline edit

const ConferenceGivingForm = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Card sx={{ p: 2 }}>
        <Typography variant='h6'>Sponsorship Information</Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextInput source="name" label="Name" fullWidth helperText={false} />
          </Grid>
          <Grid item xs={12} md={3}>
            <NumberInput source="available" label="Available" fullWidth helperText={false} prefix='$' />
          </Grid>
          <Grid item xs={12} md={3}>
            <NumberInput source="max_purchasable" label="Max Purchasable" fullWidth helperText={'How many of this sponsorship can one person buy'} prefix='$' />
          </Grid>
          <Grid item xs={12} md={3}>
            <NumberInput source="amount" label="Amount" fullWidth helperText={false} prefix='$' />
          </Grid>
          <Grid item xs={12}>
            <TextInput source="description" label="Description" fullWidth helperText={false} />
          </Grid>
          <Grid item xs={12}>
            <ReferenceInput source="conference" reference="conferences" label="Conference" fullWidth>
              <AutocompleteInput optionText="name" />
            </ReferenceInput>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  </Grid>
)

const ConferenceGiving = () => {

  const {isCreating, setIsCreating} = useContext(ConferenceContext)

  const [create] = useCreate()
  const [update] = useUpdate()
  const notify = useNotify()
  const remove = useRemoveFromStore()

  return isCreating
    ? (
      <Create sx={{mt:-2}} title={' '} redirect={false} resource="conference-sponsorships">
        <CustomSecondaryHeader title="Add Sponsorship" />
        <Button onClick={() => isCreating ? setIsCreating(false) : setIsCreating(true)}> Back</Button>
        <SimpleForm onSubmit={(formData) => createRecord(formData, create, notify, setIsCreating, 'conference-sponsorships')}>
          <ConferenceGivingForm />
        </SimpleForm>
      </Create>
    ) : (
      <>
        <DatagridConfigurable
          bulkActionButtons={false}
          expandSingle={true}
          isRowExpandable={() => true}
          isRowSelectable={() => false}
          rowClick="expand"
          sx={customDatagridStyle}
          expand={(record: RaRecord) => {
            return (
              <Edit
                sx={positionStickyComponent}
                title={' '}
                id={record.id}
                resource="conference-sponsorships"
                redirect={false}>
                <SimpleForm 
                  onSubmit={(formData) => updateRecord(formData, record, update, notify, remove, 'conference-sponsorships')}
                  toolbar={<CustomToolBar />}
                >
                  <ConferenceGivingForm />
                </SimpleForm>
              </Edit>
            )
          }}
        >
          <TextField source="name" label="Name" />
          <TextField source="description" label="Description" />
          <NumberField source="available" label="Available" />
          <NumberField source="amount" label="Amount" options={CurrencyOptions} />

        </DatagridConfigurable>
        <CustomPagination />
      </>
    )
}


export default ConferenceGiving