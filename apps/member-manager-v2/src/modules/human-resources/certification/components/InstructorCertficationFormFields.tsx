import {Box, Card, Divider, Grid, Typography} from "@mui/material"
import React from 'react'
import { DateInput, Identifier, ReferenceInput, SelectInput } from 'react-admin'
import { InstructorCertificationWaste, InstructorCertificationWasteLab, InstructorCertificationWater, InstructorCertificationWaterLab } from '../../../../helpers/Data'
import { TrainingInstructorAutocompleteInput } from '../../../_components/autocompletes/TrainingInstructorAutocomplete'

interface InstructorCertficationFormFieldsProps {
  title?: string
  id?: Identifier | null
}
const InstructorCertficationFormFields = ({title = 'Certification Details', id} : InstructorCertficationFormFieldsProps) => {
  return (
    <Box width={'100%'} >
      <Grid container spacing={0} gap={0} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
        <Grid sx={{ width: '100%' }} lg={12} alignItems={'stretch'} justifyItems={'stretch'} alignSelf={'stretch'}>
          {/* Certification Details */}
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none" }}>
            <Typography variant='h5'>{title}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container columnSpacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <ReferenceInput source="instructor" label="Instructor" reference="training-instructors"  perPage={2000} fullWidth>
                  <TrainingInstructorAutocompleteInput defaultValue={id ?? undefined}  source='instructor'/>
                </ReferenceInput>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <SelectInput helperText={false} choices={InstructorCertificationWater} source="water_certification" label="Water Certification" fullWidth />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <SelectInput helperText={false} choices={InstructorCertificationWaste} source="waste_water_certification" label="Wastewater Certification" fullWidth />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <SelectInput helperText={false} choices={InstructorCertificationWaterLab} source="water_lab_certification" label="Water Lab Certification" fullWidth />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <SelectInput helperText={false} choices={InstructorCertificationWasteLab} source="waste_water_lab_certification" label="Wastewater Lab Certification" fullWidth />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <DateInput  helperText={false} source="certification_date" label="Certification Date" fullWidth />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <DateInput source="renewal_date" label="Renewal Date" fullWidth />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default InstructorCertficationFormFields
