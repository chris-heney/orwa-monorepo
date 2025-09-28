import { List, Datagrid, TextField, DateField, DeleteButton, BooleanField } from 'react-admin'

export default function TopicList() {
  return (
    <List resource="pub-sub-topic" title="Topics">
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="name" />
        <BooleanField source="onCreate" label="On Create" />
        <BooleanField source="onUpdate" label="On Update" />
        <BooleanField source="onDelete" label="On Delete" />
        <DateField source="createdAt" />
        <DeleteButton />
      </Datagrid>
    </List>
  )
}


