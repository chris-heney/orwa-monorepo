import React from 'react'
import { useGetRecordId} from 'react-admin'
import EditHumanResource from '../EditHumanResource'


const StaffEdit = () => {
  const id = useGetRecordId()
  return (
    <EditHumanResource id={id} resource='staff'/>
  )
}

export default StaffEdit