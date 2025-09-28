import { Create, SimpleForm, TextInput } from 'react-admin'

export default function TopicCreate() {
  return (
    <Create resource="pub-sub-topic" title="Create Topic">
      <SimpleForm>
        <TextInput source="name" />
      </SimpleForm>
    </Create>
  )
}


