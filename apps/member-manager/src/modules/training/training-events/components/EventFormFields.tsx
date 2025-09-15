import React, { useEffect, useState } from 'react'
import {Button, Card, Grid, Modal, Typography} from "@mui/material"
import {
  BooleanInput,
  DateTimeInput,
  FormDataConsumer,
  Identifier,
  RaRecord,
  ReferenceInput,
  SelectInput,
  TextInput,
  useGetList,
  useRecordContext,
  AutocompleteInput,
  // NumberInput,
} from 'react-admin'
import { TrainingInstructorAutocompleteInput } from '../../../_components/autocompletes/TrainingInstructorAutocomplete'
import { AudienceChoices, ClassTypeOptions, StateChoices } from '../../../../helpers/Data'
import CustomPhoneInput from '../../../_components/MaskedPhoneInput'
import { VenueAutocompleteInput } from '../../../_components/autocompletes/VenueAutocomplete'
import { useFormContext } from 'react-hook-form'
import ModalProgram from './EventModalProgram'


export interface Venue {
  id: number
  street: string
  city: string
  state: string
  zip: string
}

const EventFormFields = () => {
  const record = useRecordContext()
  const form = useFormContext()

  const eventsList = useGetList('training-events', {
    pagination: { page: 1, perPage: 1000 },
  })
  const filteredEventsList = eventsList?.data ?? []
  const currentDate = new Date().getFullYear()
  const fiscalYearStart = new Date(currentDate - 1, 6, 1)
  const fiscalYearEnd = new Date(currentDate, 6, 1)

  const filteredEvents = filteredEventsList.filter(event =>
    event &&
    new Date(event.end) > fiscalYearStart &&
    new Date(event.end) < fiscalYearEnd &&
    event.training_type.includes('Class')
  )

  const trainingType = form.watch('training_type')
  const [venue, setVenue] = useState<Venue | RaRecord<Identifier>>()
  const [certificationFilter, setCertificationFilter] = useState(' ')
  const [isProgramOpen, setIsPorgramOpen] = useState(false)

  useEffect(() => {
    if (venue && typeof venue === 'object') {
      form.setValue('address.street', venue.street, { shouldDirty: false })
      form.setValue('address.city', venue.city, { shouldDirty: false })
      form.setValue('address.state', venue.state, { shouldDirty: false })
      form.setValue('venue_id', venue.id, { shouldDirty: false })
      form.setValue('address.zip', venue.zip, { shouldDirty: false })
    }
  }, [venue])


  const defaultStartDate = new Date()
  const defaultEndDate = new Date()
  const defaultExamDate = new Date()
  defaultEndDate.setDate(defaultEndDate.getDate() + 1)
  defaultStartDate.setHours(8, 0, 0)
  defaultEndDate.setHours(17, 0, 0)
  defaultExamDate.setDate(defaultExamDate.getDate() + 1)
  defaultExamDate.setHours(15, 0, 0)

  //dedfault location code to current year
  const currentYear = new Date().getFullYear().toString().slice(2, 4)
  const defaultLocationCode = !eventsList.isLoading ? `${currentYear}${filteredEvents.length ? filteredEvents.length + 1 : ''}` : currentYear


  useEffect(() => {
    trainingType ? trainingType.includes('Renewal') ? form.setValue('audience', 'Operators & Managers', { shouldDirty: false }) : null : null
    trainingType ? trainingType.includes('Board') ? form.setValue('audience', 'Decision Makers', { shouldDirty: false }) : null : null
    trainingType ? trainingType.includes('Class') ? form.setValue('audience', 'Operators & Managers', { shouldDirty: false }) : null : null
    trainingType ? trainingType.includes('Class') ? form.setValue('location', defaultLocationCode, { shouldDirty: false }) : null : null
    setCertificationFilter(trainingType)
  }, [trainingType])

  const deqExam = form.watch('deq_exam')

  useEffect(() => {
    deqExam === false
      ? form.setValue('exam_datetime', null, { shouldDirty: false })
      : null
  }, [deqExam])

  useEffect(() => {
    if (trainingType && !trainingType.includes('Class')) {
      form.setValue('location', null, { shouldDirty: false })
    }
  }, [trainingType, form])


  return (
    <>
      <Grid container spacing={0} gap={0} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
        <Grid xs={12} md={6} sm={12} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>

          {/* DETAILS */}
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <Typography variant='h5'>Details</Typography>
            <SelectInput helperText={false} source="training_type" label="Training Type" choices={ClassTypeOptions} fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
            <Grid xs={12} sm={12} md={12} lg={12}>
              <Button onClick={() => setIsPorgramOpen(true)}>Add Program</Button>
              <ReferenceInput
                reference="programs"
                source="program_billed"
                sort={{ field: 'name', order: 'ASC' }}
              >
                <AutocompleteInput helperText={false} defaultValue={1} optionText={'name'} />
              </ReferenceInput>
            </Grid>
            <SelectInput helperText={false} source="audience" label="Audience" choices={AudienceChoices} fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
            <TextInput defaultValue={record ? record.status : 'DRAFT'} source="status" label="Status" hidden sx={{ display: 'none' }} fullWidth />
            {<ReferenceInput
              reference="training-schedules"
              source="schedule"
            >
              <AutocompleteInput hidden helperText={false} defaultValue={record ? record.schedule : null} optionText={'id'} />
            </ReferenceInput>}
            {/* <Grid>
              <NumberInput source='hours' helperText={'This is Automatically Calculated'} />
            </Grid> */}
          </Card>

          {/* LOCATION */}
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <Typography variant='h5'>Location</Typography>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <VenueAutocompleteInput venue={venue} setVenue={setVenue} />
              </Grid>
              <Grid style={{ display: 'none' }}>
                <TextInput source="venue_id" hidden fullWidth />
              </Grid>

              <FormDataConsumer<{ training_type: string }>>
                {({ formData }) => (formData.training_type && formData.training_type.startsWith('Class')) &&
                  <Grid xs={6}>
                    <TextInput
                      helperText={false}
                      source="location"
                      label="Location Code"
                      fullWidth
                      defaultValue={defaultLocationCode}
                      disabled={record && (record.status !== 'REVIEW' && record.status !== 'DRAFT')}
                    />
                  </Grid>
                }
              </FormDataConsumer>

              <Grid xs={6}>
                <TextInput helperText={false} defaultValue={venue?.street} source="address.street" label="Street" fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
              </Grid>
              <Grid xs={6}>
                <TextInput helperText={false} defaultValue={venue?.city} source="address.city" label="City" fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
              </Grid>
              <Grid xs={6}>
                <SelectInput helperText={false} defaultValue={venue?.state} source="address.state" label="State" choices={StateChoices} fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
              </Grid>
              <Grid xs={6}>
                <TextInput helperText={false} defaultValue={venue?.zip} source="address.zip" label="Zip" fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid xs={12} md={6} sm={12} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
          {/* EVENT DATES */}
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <Typography variant='h5'>Dates</Typography>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <DateTimeInput
                  helperText={false}
                  source="start"
                  label="Start Date"
                  fullWidth
                  disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'}
                  defaultValue={defaultStartDate}
                />
              </Grid>
              <Grid xs={6}>
                <DateTimeInput
                  helperText={false}
                  source="end"
                  label="End Date"
                  fullWidth
                  disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'}
                  defaultValue={defaultEndDate}
                />
              </Grid>
              <Grid mt={2} xs={6}>
                <BooleanInput helperText={false} source="deq_exam" label="DEQ Exam" fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
              </Grid>

              <Grid xs={6}>
                <FormDataConsumer<{ deq_exam: boolean }>>
                  {({ formData }) => formData.deq_exam &&
                    <DateTimeInput
                      helperText={false}
                      source="exam_datetime"
                      label="Exam Date"
                      fullWidth
                      defaultValue={defaultExamDate}
                      disabled={record && (record.status !== 'REVIEW' && record.status !== 'DRAFT')}
                    />
                  }
                </FormDataConsumer>
              </Grid>

            </Grid>
          </Card>

          {/* INSTRUCTOR */}
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <Typography variant='h5'>Instructor Information</Typography>
            <Typography variant='body1'>Please enter the instructor information below. If the instructor is not in the system, please click the &quot;Add Instructor&quot; button to add them.</Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <ReferenceInput
                  reference="training-instructors"
                  source="instructor"
                >
                  <TrainingInstructorAutocompleteInput filter={certificationFilter} source={'instructor'} />
                </ReferenceInput>
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <CustomPhoneInput helperText={false} placeholder="(123) 456-7890" source="phone" label="Phone" fullWidth disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'} />
              </Grid>
            </Grid>
          </Card>

          {/* NOTES */}
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
            <Typography variant='h5'>Notes</Typography>
            <TextInput helperText={false} source="private_notes" label="Internal Notes" fullWidth multiline rows={5} />
            <TextInput helperText={false} source="public_notes" label="Public Notes" fullWidth multiline rows={5} />
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={isProgramOpen}
        onClose={() => setIsPorgramOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* @TODO: Cleanup: Figure out how to incorporate ref to TopicModal so we don't have to wrap it in a fragment */}
        <><ModalProgram setIsModalOpen={setIsPorgramOpen} /></>
      </Modal>
    </>
  )
}

export default EventFormFields