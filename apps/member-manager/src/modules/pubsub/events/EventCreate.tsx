import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput } from 'react-admin'

export default function EventCreate() {
  return (
    <Create resource="pub-sub-event" title="Publish Event">
      <SimpleForm>
        <ReferenceInput source="topicId" reference="pub-sub-topic" label="Topic">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="payload" multiline helperText="JSON string" />
      </SimpleForm>
    </Create>
  )
}


