import React from 'react'
import {
  List,
} from 'react-admin'
import CustomListActions from '../../_components/CustomListActions'
import GrantListCardGrid from './components/GrantCarGrid'


const GrantList = () => {

  return (
    <List component={'div'} title={' '} actions={<CustomListActions createButtonLabel="New Grant" />}>
      <GrantListCardGrid/>
    </List>
  )
}
export default GrantList