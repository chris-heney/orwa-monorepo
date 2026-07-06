import React from 'react'
import { DateInput, Edit, NumberInput, ReferenceField, SimpleForm, TextInput } from 'react-admin'
import CustomHeader from '../../_components/CustomHeader'

const EditPayoutMobile = () => {
  return (
    <Edit>
      <CustomHeader title="Edit Payout" />
      <SimpleForm>
        <TextInput source="status" label="Status" defaultValue={'Requested'} fullWidth helperText={false} key="payout-field-requested" disabled />]
        <ReferenceField source='application' reference='grant-application-finals' label='Application' link={false} sortBy='application.legal_entity_name'>
          <TextInput source='legal_entity_name' label='System Name' fullWidth disabled helperText={false} />
        </ReferenceField>
        <>{ }</>
        <>{ }</>
        <NumberInput source="amount" label="Payout" fullWidth helperText={false} key="payout-field-amounbt" />),
        <DateInput defaultValue={new Date()} source="transaction_date" label="Payout Date" fullWidth helperText={false} key="payout-field-4" />)
        <>{ }</>
      </SimpleForm>
    </Edit>
  )
}

export default EditPayoutMobile
