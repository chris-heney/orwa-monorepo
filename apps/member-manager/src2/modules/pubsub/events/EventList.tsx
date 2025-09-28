import { List, Datagrid, TextField, DateField } from 'react-admin'

export default function EventList() {
  return (
    <List resource="pub-sub-event" title="Events">
      <Datagrid rowClick={false} bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="topic.name" label="Topic" />
        <TextField source="payload" />
        <DateField source="enqueuedAt" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  )
}


