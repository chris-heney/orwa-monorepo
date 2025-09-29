import { 
  ListBase,
  Title,
  ListToolbar,
  Pagination,
} from 'react-admin'
import { Card } from '@mui/material'
import { ReactElement } from 'react'
import React from 'react'
const CustomList = ( { 
  children,
  actions,
  title,
  ...props
}: { 
    children: ReactElement,
    actions: ReactElement,
    title: string,
}) => (
  <ListBase {...props}>
    <Title title={title}/>
    <ListToolbar actions={actions} />
    <Card>
      {children}
    </Card>
    <Pagination rowsPerPageOptions={[10, 25, 50, 100]} sx={{ margin: '0 auto 0 0'}} />
  </ListBase>
)

export default CustomList