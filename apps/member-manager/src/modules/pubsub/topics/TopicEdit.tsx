import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin'

export default function TopicEdit() {
  return (
    <Edit resource="pub-sub-topic" title="Edit Topic">
      <SimpleForm>
        <TextInput source="name" />
        <BooleanInput source="onCreate" label="On Create" />
        <BooleanInput source="onUpdate" label="On Update" />
        <BooleanInput source="onDelete" label="On Delete" />
      </SimpleForm>
    </Edit>
  )
}


