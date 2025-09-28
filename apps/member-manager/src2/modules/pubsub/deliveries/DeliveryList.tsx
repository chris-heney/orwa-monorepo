import { List, Datagrid, TextField, NumberField, DateField } from 'react-admin'

export default function DeliveryList() {
  return (
    <List resource="pub-sub-delivery" title="Deliveries">
      <Datagrid rowClick={false} bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="eventId" />
        <TextField source="subscriberId" />
        <TextField source="status" />
        <NumberField source="attempts" />
        <TextField source="lastError" />
        <DateField source="createdAt" />
      </Datagrid>
    </List>
  )
}


