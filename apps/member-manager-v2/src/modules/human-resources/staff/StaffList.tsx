import React from 'react'
import {
  List,
} from 'react-admin'
import StaffListCardGrid from './_components/StaffListCardGrid'
import { useHumanResourcesContext } from '../HumanResourcesContext'

interface StaffListProps {
  title?: string
}

const StaffList = ({title = 'Staff'} : StaffListProps) => {
  const { staffFilters } = useHumanResourcesContext();
  
  return (
    <List 
      disableSyncWithLocation
      title={title} 
      resource="staff" 
      actions={false} 
      exporter={false}
      filter={staffFilters || {}}
      filterDefaultValues={staffFilters || {}}
      component="div"
      sx={{
        '& .RaList-noActions': {
          mt: '0',
        },
      }}>
      <StaffListCardGrid />
    </List>
  )
}


export default StaffList

