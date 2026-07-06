import React from 'react'
import {
  DeleteButton,
  EditButton,
} from 'react-admin'
import TopToolbar from './CustomToptoolBar'

const EditableDatagridListActions = ({
  hasDelete = true,
  hasEdit = true,
}: {
  hasDelete?: boolean
  hasEdit?: boolean
}) => {
  return (

    <TopToolbar sx={{
      right: 0,
      WebkitJustifyContent: 'flex-start',
    }}>
      {hasEdit && <DeleteButton/>}
      {hasDelete && <EditButton/>}
    </TopToolbar>
  )
}

export default EditableDatagridListActions
