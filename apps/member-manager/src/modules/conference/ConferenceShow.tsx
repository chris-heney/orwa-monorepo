import React from 'react'
import {
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
  useRedirect,
} from 'react-admin'
import PageHeadingBar from '../_components/PageHeadingBar'
import { formResourceShellSx } from '../../css/formLayout'

const ConferenceShowHeading = () => {
  const record = useRecordContext()
  const redirect = useRedirect()
  return (
    <PageHeadingBar
      title={record?.name ?? 'Conference'}
      onBack={() => redirect('/conference/dashboard')}
    />
  )
}

/** Read-only conference card; Back far right (PageHeadingBar), no outer margin. */
const ConferenceShow = () => {
  return (
    <Show title=" " actions={false} component="div" sx={formResourceShellSx}>
      <ConferenceShowHeading />
      <SimpleShowLayout>
        <TextField source="name" />
        <NumberField source="year" />
        <TextField source="status" />
        <DateField source="start_date" />
        <DateField source="end_date" />
        <TextField source="description" />
      </SimpleShowLayout>
    </Show>
  )
}

export default ConferenceShow
