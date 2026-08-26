import React, { useContext } from 'react'
import {
  AutocompleteInput,
  BooleanInput,
  Create,
  Edit,
  FormDataConsumer,
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
import { DatagridConfigurable } from '@orwa/entity-id'
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
            <NumberInput source="available" label="Available" fullWidth helperText={false} />
          </Grid>
          <FormDataConsumer>
            {({ formData }) =>
              formData?.allow_custom_amount ? null : (
                <Grid item xs={12} md={3}>
                  <NumberInput
                    source="max_purchasable"
                    label="Max Purchasable"
                    fullWidth
                    helperText={'How many of this sponsorship can one person buy'}
                  />
                </Grid>
              )
            }
          </FormDataConsumer>
          <Grid item xs={12} md={3}>
            <FormDataConsumer>
              {({ formData }) => (
                <NumberInput
                  source="amount"
                  label={formData?.allow_custom_amount ? 'Minimum Amount' : 'Amount'}
                  fullWidth
                  helperText={
                    formData?.allow_custom_amount
                      ? 'Sponsors may enter any amount at or above this minimum'
                      : false
                  }
                  prefix='$'
                />
              )}
            </FormDataConsumer>
            <BooleanInput
              source="allow_custom_amount"
              label="Allow sponsor to donate custom amount."
              helperText={false}
              sx={{ mt: 0.5 }}
            />
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

const withCustomAmountDefaults = (formData: RaRecord) => {
  if (!formData?.allow_custom_amount) return formData
  return {
    ...formData,
    max_purchasable: 1,
  }
}

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
        <SimpleForm
          onSubmit={(formData) =>
            createRecord(
              withCustomAmountDefaults(formData as RaRecord),
              create,
              notify,
              setIsCreating,
              'conference-sponsorships'
            )
          }
        >
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
                  onSubmit={(formData) =>
                    updateRecord(
                      withCustomAmountDefaults(formData as RaRecord),
                      record,
                      update,
                      notify,
                      remove,
                      'conference-sponsorships'
                    )
                  }
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
