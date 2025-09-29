import {Box, Button, Card, Divider, Grid, Theme, Typography, useMediaQuery} from "@mui/material"
import React from 'react'
import { AutocompleteInput, BooleanInput, Create, DatagridConfigurable, Edit, List, RaRecord, ReferenceInput, SimpleForm, TextField, TextInput, useCreate, useNotify } from 'react-admin'
import AddIcon from '@mui/icons-material/Add'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'
import { FieldValues } from 'react-hook-form'
import CustomToolBar from '../../../_components/CustomToolbar'


interface CustomInterfaceProps {
  resource: string
  rows: { source: string, label: string, type: 'boolean' | 'string' | 'number' | 'reference', multiline?: boolean, rows?: number, refernece?: string }[]
  title: string
  createTitle?: string
  InputFields?: () => React.ReactElement
  inputs?: { source: string, label: string, type: 'boolean' | 'string' | 'number' | 'reference', multiline?: boolean, rows?: number, refernece?: string }[]
}

const CustomInterface = ({ rows, resource, createTitle, InputFields, inputs }: CustomInterfaceProps) => {
  const [isCreating, setIsCreating] = React.useState(false)
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  const title = resource.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const [create] = useCreate()
  const notify = useNotify()
  const createProjectType = (data: FieldValues) => {
    create(resource, { data })
    notify(`New ${title} Type was Created`, { type: 'success' })
    setIsCreating(false)
  }

  const DefaultInputFields = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={1}>
          {inputs?.map((input, index: number) => {
            if (input.type === 'string') {
              return (
                <Grid key={`key-${index}`} xs={12} md={6}>
                  <TextInput source={input.source} label={input.label} fullWidth helperText={false} />
                </Grid>
              )
            } else if (input.type === 'number') {
              return (
                <Grid key={`key-${index}`} xs={12} md={6}>
                  <TextInput source={input.source}  label={input.label} fullWidth helperText={false} />
                </Grid>
              )
            } else if (input.type === 'boolean') {
              return (
                <Grid key={`key-${index}`} xs={12} md={6}>
                  <BooleanInput source={input.source}  label={input.label} fullWidth helperText={false} />
                </Grid>
              )
            }
            else if (input.type === 'reference' && input.refernece) {
              return (
                <Grid key={`key-${index}`} xs={12} md={6}>
                  <ReferenceInput source={input.source} reference={input.refernece} label={input.label} fullWidth helperText={false}>
                    <AutocompleteInput optionText="name" />
                  </ReferenceInput>
                </Grid>
              )
            }
          })}
        </Grid>
      </Box>
    )
  }

  return isCreating ? (
    <Box>
      <Create sx={{ mt: -2 }} redirect={false} title={' '} resource={resource}>
        <CustomSecondaryHeader title={`Add ${title}`} />
        <Button onClick={() => isCreating ? setIsCreating(false) : setIsCreating(true)}>Back</Button>
        <SimpleForm onSubmit={createProjectType}>
          {InputFields ? (
            <InputFields />
          )
            : (
              <DefaultInputFields />
            )}
        </SimpleForm>
      </Create>
    </Box>
  )
    : (
      <Card >
        {/* place button far right */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography ml={2} variant="h6">{title}</Typography>
          <Button onClick={() => setIsCreating(true)}> {isSmall ? '' : createTitle} <AddIcon /></Button>
        </Box>
        <Divider />
        <List
          disableSyncWithLocation
          title={' '}
          actions={false}
          resource={resource}
          exporter={false}
        >

          <DatagridConfigurable
            bulkActionButtons={false}
            expandSingle={true}
            isRowExpandable={() => true}
            isRowSelectable={() => false}
            expand={(record: RaRecord) => (
              <Edit redirect={false} component={'div'} title={' '} id={record.id}>
                <SimpleForm toolbar={<CustomToolBar />}>
                  {InputFields ? (
                    <InputFields />
                  )
                    : (
                      <DefaultInputFields />
                    )}
                </SimpleForm>
              </Edit>
            )}
            sx={{ '& .css-dsuxgy-MuiTableCell-root': { padding: '0px', alignItems: 'center' } }}
          >
            {rows.map((choice, index) => <TextField key={`field${index}`} source={choice.source} label={choice.label} />)}
          </DatagridConfigurable>
        </List>
      </Card>
    )
}

export default CustomInterface


