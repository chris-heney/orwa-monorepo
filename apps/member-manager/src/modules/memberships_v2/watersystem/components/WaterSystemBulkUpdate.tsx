import {Box, Button, Grid, MenuItem, Modal, Select, Typography} from "@mui/material"
import React, { useState } from 'react'
import { AutocompleteArrayInput, BooleanInput, ConfigurableDatagridColumn, DateInput, List, NumberInput, ReferenceArrayInput, SelectInput, SimpleForm, SimpleList, TextInput, useNotify, useStore, useUpdateMany } from 'react-admin'
import { FieldValues } from 'react-hook-form'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'
import { StateChoices, WatersystemMemberTypeChoices, countyOptions, paymentOptions, regionOptions, reportType } from '../../../../helpers/Data'
import UpdateIcon from '@mui/icons-material/Update'
import CustomToolBar from '../../../_components/CustomToolbar'

const WaterSystemBulkUpdateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const watersystemIds = useStore('watersystems.selectedIds')
  const sources = useStore('preferences.watersystems.datagrid.availableColumns')
  const sourceOptions = sources[0].map((source: ConfigurableDatagridColumn) => source.source)
  const labelOptions = sources[0].map((source: ConfigurableDatagridColumn) => source.label)
  const [selectedField, setSelectedField] = useState(sourceOptions[0])
  const [index, setIndex] = useState(0)
  const selectedIds = watersystemIds[0]

  const notify = useNotify()
  const [updateMany] = useUpdateMany()
  const onSubmit = async (formValue: FieldValues) => {
    try {
      await updateMany('watersystems', {
        ids: selectedIds,
        data: formValue
      })
      notify('Watersystems Updated', { type: 'success' })
      setIsModalOpen(false)
    }
    catch (error) {
      notify('Error: Watersystems not updated', { type: 'error' })
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}><UpdateIcon sx={{ mr: 1 }} /> Bulk Update Selected Watersystems</Button>
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
          <CustomSecondaryHeader title='Bulk Update Watersystems' />
          {/* left side field to update right side is list of water systems being updated */}
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography textAlign={'center'} variant='h6'>Selected Field</Typography>
              <Box sx={{ p: 1, display: 'flex' , mt: 2.5}}>
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
                <SimpleForm
                  toolbar={<CustomToolBar/>}
                  sx={{
                    height: 300,
                  }}
                  onSubmit={(formValues) => onSubmit(formValues)}>
                  {(selectedField === 'active'
                    || selectedField === 'directory_mailed'
                    || selectedField === 'funding'
                    || selectedField === 'orwaag'
                    || selectedField === 'workmans_comp'
                    || selectedField === 'soonerwarn'
                  ) &&
                    <BooleanInput source={selectedField} label={labelOptions[index]} fullWidth helperText={false} />
                  }
                  {(selectedField === 'payment_last_date'
                    || selectedField === 'application_date'
                    || selectedField === 'payment_previous_date'
                    || selectedField === 'directory_sent_date'
                  ) &&
                    <DateInput source={selectedField} label={labelOptions[index]} defaultValue={new Date()} fullWidth helperText={false} />
                  }
                  {(selectedField === 'meters'
                    || selectedField === 'total_years'
                  ) &&
                    <NumberInput source={selectedField} label={labelOptions[index]} fullWidth helperText={false} />
                  }
                  {(selectedField === 'region'
                    || selectedField === 'county'
                    || selectedField === 'member_type'
                    || selectedField === 'system_type_dirty'
                    || selectedField === 'annual_report_type'
                    || selectedField === 'membership_directory_type'
                    || selectedField === 'payment_method'
                    || selectedField === 'address_mailing_state'
                    || selectedField === 'address_physical_state'
                  ) &&
                    <SelectInput source={selectedField} label={labelOptions[index]} fullWidth choices={[
                      selectedField === 'region' ? regionOptions
                        : selectedField === 'county' ? countyOptions
                          : selectedField === 'member_type' ? WatersystemMemberTypeChoices
                            : selectedField === 'annual_report_type' ? reportType
                              : selectedField === 'membership_directory_type' ? reportType
                                : selectedField === 'payment_method' ? paymentOptions
                                  : selectedField === 'address_mailing_state' ? StateChoices
                                    : selectedField === 'address_physical_state' ? StateChoices
                                      : []
                    ]} helperText={false} />}

                  {(selectedField === 'name'
                    || selectedField === 'office_hours'
                    || selectedField === 'url'
                    || selectedField === 'board_meeting'
                    || selectedField === 'email'
                    || selectedField === 'phone'
                    || selectedField === 'fax'
                    || selectedField === 'latitude'
                    || selectedField === 'longitude'
                    || selectedField === 'address_mailing_pobox'
                    || selectedField === 'address_mailing_city'
                    || selectedField === 'address_mailing_zip'
                    || selectedField === 'address_physical_line1'
                    || selectedField === 'address_physical_line2'
                    || selectedField === 'address_physical_city'
                    || selectedField === 'address_physical_zip'
                    || selectedField === 'payment_details'
                    || selectedField === 'legal_entity_name'
                  ) && <TextInput source={selectedField} label={labelOptions[index]} fullWidth helperText={false} />}

                  {selectedField === 'contacts' &&
                    <ReferenceArrayInput reference='contacts' source={selectedField} label={labelOptions[index]} fullWidth helperText={false}>
                      <AutocompleteArrayInput fullWidth optionText={(record) => record.first + ' ' + record.last} helperText={false} />
                    </ReferenceArrayInput>
                  }


                </SimpleForm>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Typography textAlign={'center'} variant='h6'>Selected Watersystems</Typography>
              <List
                title={' '}
                filter={{ id: selectedIds }}
                disableSyncWithLocation
                sx={{ mt: -4 }}
                hasCreate={false}
                exporter={false}
                resource='watersystems'
              >
                <SimpleList
                  sx={{ overflowY: 'scroll', maxHeight: 400 }}
                  primaryText={(record) => record.name}
                  secondaryText={(record) => (record.region === null ? 'No Region' : record.region) + ' | ' + (record.active ? 'Active' : 'Inactive')}
                  tertiaryText={record => record.county} />
              </List>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default WaterSystemBulkUpdateButton