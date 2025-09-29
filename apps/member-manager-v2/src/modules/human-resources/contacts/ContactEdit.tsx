import React from 'react'
import { useGetRecordId} from 'react-admin'
import EditHumanResource from '../EditHumanResource'


const ContactEdit = () => {
  const id = useGetRecordId()
  return (
    <EditHumanResource id={id} resource='contacts'/>
  )
}

export default ContactEdit