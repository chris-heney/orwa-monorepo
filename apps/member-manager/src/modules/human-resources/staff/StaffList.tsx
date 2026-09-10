import React from 'react'
import { Box } from '@mui/material'
import { List, ListView } from 'react-admin'
import StaffListCardGrid from './_components/StaffListCardGrid'

/**
 * Settings → Staff tab panel: renders inside the tab's ListScope (no second
 * `<List>`); the card grid carries its own gutter.
 */
export const StaffPanel = () => (
  <ListView actions={false} title=" " component="div">
    <Box sx={{ p: 2 }}>
      <StaffListCardGrid />
    </Box>
  </ListView>
)

interface StaffListProps {
  title?: string
}

/** Standalone `/staff` resource list (outside the framework shell). */
const StaffList = ({ title = 'Staff' }: StaffListProps) => (
  <List
    disableSyncWithLocation
    title={title}
    resource="staff"
    actions={false}
    exporter={false}
    component="div"
  >
    <StaffListCardGrid />
  </List>
)

export default StaffList
