import React from 'react'
import { useGetRecordId} from 'react-admin'
import EditHumanResource from '../EditHumanResource'


const InstructorEdit = () => {
  const id = useGetRecordId()
  return (
    <EditHumanResource id={id} resource='training-instructors'/>
  )
}

export default InstructorEdit