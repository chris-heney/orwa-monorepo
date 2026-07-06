import { RowForm } from '@react-admin/ra-editable-datagrid'
import React from 'react'
import { usePreference } from 'react-admin'
import { ReactNode } from 'react'
interface Column {
  source: string
  index: number
}
interface RowFormConfigurableProps {
  children: ReactNode
}

const RowFormConfigurable: React.FC<RowFormConfigurableProps> = ({ children }) => {
  const [availableColumns] = usePreference<Column[]>('availableColumns', [])
  const [omit] = usePreference<string[]>('omit', [])
  const [columns] = usePreference<number[]>(
    'columns',
    availableColumns
      .filter(column => !omit?.includes(column.source))
      .map(column => column.index)
  )

  const childrenArray = React.Children.toArray(children)

  return (
    <RowForm>
      {columns === undefined
        ? children
        : columns.map(index => childrenArray[index])}
    </RowForm>
  )
}

export default RowFormConfigurable