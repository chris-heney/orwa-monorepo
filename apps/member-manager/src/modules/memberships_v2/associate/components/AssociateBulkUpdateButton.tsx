import { Box, Button, Grid, MenuItem, Modal, Select, Typography } from '@mui/material'
import React, { useState } from 'react'
import { AutocompleteArrayInput, AutocompleteInput, BooleanInput, ConfigurableDatagridColumn, DateInput, List, NumberInput, ReferenceArrayInput, ReferenceInput, SelectInput, SimpleForm, SimpleList, TextInput, useNotify, useStore, useUpdateMany } from 'react-admin'
import { FieldValues } from 'react-hook-form'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'
import { AssociateMemberTypeChoices, StateChoices, associateTypeOptions, paymentOptions, reportType } from '../../../../helpers/Data'
import UpdateIcon from '@mui/icons-material/Update'
import CustomToolBar from '../../../_components/CustomToolbar'
import { isMembershipActiveByExpiration } from '../../../_helpers/getExpirationDate'

const AssociateBulkUpdateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const watersystemIds = useStore('associates.selectedIds')
  const sources = useStore('preferences.associates.datagrid.availableColumns')
  const sourceOptions = sources[0].map((source: ConfigurableDatagridColumn) => source.source)
  const labelOptions = sources[0].map((source: ConfigurableDatagridColumn) => source.label)
  const [selectedField, setSelectedField] = useState(sourceOptions[0])
  const [index, setIndex] = useState(0)
  const selectedIds = watersystemIds[0]

  const notify = useNotify()
  const [updateMany] = useUpdateMany()
  const onSubmit = async (formValue: FieldValues) => {
    try {
      await updateMany('associates', {
        ids: selectedIds,
        data: formValue
      })
      notify('Associates Updated', { type: 'success' })
      setIsModalOpen(false)
    }
    catch (error) {
      notify('Error: Associates not updated', { type: 'error' })
      setIsModalOpen(false)
    }
  }
  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}><UpdateIcon sx={{mr: 1}}/> Bulk Update Selected Associates</Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
          }}>
          <CustomSecondaryHeader title='Bulk Update Associates' />
          {/* left side field to update right side is list of water systems being updated */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography textAlign={'center'} variant='h6'>Selected Field</Typography>
              <Box sx={{ p: 1, display: 'flex', mt: 2.5 }}>
                <Select
                  sx={{ p: 0 }}
                  size='small'
                  variant='filled'
                  fullWidth
                  onChange={(event) => {
                    setSelectedField(event.target.value as string)
                    setIndex(labelOptions.indexOf(event.target.value as string))
                  }}
                  value={selectedField}
                >
                  {labelOptions.map((label: string, index: number) => (
                    <MenuItem key={index} value={sourceOptions[index]}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Typography ml={1} textAlign={'left'} variant='subtitle2' fontSize={12} >Please Select the Desired Field to Update</Typography>
              <Box>
                <SimpleForm sx={{
                  height: 300,
                }} 
                onSubmit={(formValues) => onSubmit(formValues)}
                toolbar={<CustomToolBar/>}
                >

                  {(selectedField === 'active' || selectedField === 'directory_mailed') &&
                    <BooleanInput source={selectedField} label={labelOptions[index]} fullWidth helperText={false} />
                  }
                  {(selectedField === 'payment_last_date'
                    || selectedField === 'application_date'
                    || selectedField === 'payment_previous_date'
                    || selectedField === 'directory_sent_date'
                  ) && <DateInput source={selectedField} defaultValue={new Date()} label={labelOptions[index]} fullWidth helperText={false} />}
                  {(selectedField === 'payment_amount'
                    || selectedField === 'wp_uid'
                    || selectedField === 'wp_eid'
                    || selectedField === 'total_years'
                  ) && <NumberInput source={selectedField} label={labelOptions[index]} fullWidth helperText={false} />}
                  {(selectedField === 'category' || selectedField === 'membership_directory_type' || selectedField === 'annual_report_type' || selectedField === 'payment_method' || selectedField === 'member_level') &&
                    <SelectInput source={selectedField} label={labelOptions[index]} fullWidth choices={
                      selectedField === 'category' ? associateTypeOptions
                        : selectedField === 'membership_directory_type' ? reportType
                          : selectedField === 'annual_report_type' ? reportType
                            : selectedField === 'payment_method' ? paymentOptions
                              : selectedField === 'member_level' ? AssociateMemberTypeChoices
                                : []
                    } helperText={false} />
                  }
                  {(selectedField === 'name'
                    || selectedField === 'website'
                    || selectedField === 'phone'
                    || selectedField === 'email'
                    || selectedField === 'address_street'
                    || selectedField === 'address_city'
                    || selectedField === 'address_zip'
                    || selectedField === 'payment_details'
                  ) && <TextInput source={selectedField} label={labelOptions[index]} fullWidth helperText={false} />}

                  {selectedField === 'address_state' && <SelectInput source={selectedField} label={labelOptions[index]} fullWidth choices={StateChoices} helperText={false} />}
                  {selectedField === 'contacts' && 
                  <ReferenceArrayInput 
                    perPage={1000} 
                    source={selectedField} 
                    label={labelOptions[index]} 
                    reference="contacts" 
                    fullWidth 
                    helperText={false} 
                  >
                    <AutocompleteArrayInput fullWidth optionText={(record) => record.first + ' ' + record.last} helperText={false} />
                  </ReferenceArrayInput>}
                  {(selectedField === 'contact_primary' || selectedField === 'contact_secondary') &&
                    <ReferenceInput reference='contacts' source={selectedField} fullWidth perPage={1000} helperText={false}>
                      <AutocompleteInput fullWidth optionText={(record) => record.first + ' ' + record.last} helperText={false} />
                    </ReferenceInput>
                  }
                </SimpleForm>
              </Box>
            </Grid>
            <Grid item xs={6} >
              <Typography textAlign={'center'} variant='h6'>Selected Associates</Typography>
              <List
                title={' '}
                filter={{ id: selectedIds }}
                disableSyncWithLocation
                sx={{ mt: -4 }}
                hasCreate={false}
                exporter={false}
                resource='associates'
              >
                <SimpleList
                  sx={{ overflowY: 'scroll', maxHeight: 400 }}
                  primaryText={(record) => record.name}
                  secondaryText={(record) =>
                    (record.member_level === null
                      ? 'No Level'
                      : record.member_level) +
                    ' | ' +
                    (isMembershipActiveByExpiration(
                      record.payment_previous_date,
                      record.payment_last_date
                    )
                      ? 'Active'
                      : 'Inactive')}
                  tertiaryText={record => record.county} />
              </List>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default AssociateBulkUpdateButton