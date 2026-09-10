import React from 'react'
import { Box } from '@mui/material'
import { List, ListView } from 'react-admin'
import InstructorListCardGird from './components/TrainingInstructorCardGrid'

/**
 * Settings → Instructors tab panel: renders inside the tab's ListScope (no
 * second `<List>`); the card grid carries its own gutter.
 */
export const InstructorsPanel = () => (
  <ListView actions={false} title=" " component="div">
    <Box sx={{ p: 2 }}>
      <InstructorListCardGird source="instructor" />
    </Box>
  </ListView>
)

interface InstructorListProps {
  title?: string
}

/** Standalone `/training-instructors` resource list (outside the framework shell). */
const InstructorsList = ({ title = 'Training Instructors' }: InstructorListProps) => (
  <List
    disableSyncWithLocation
    component="div"
    resource="training-instructors"
    title={title}
    actions={false}
    exporter={false}
  >
    <InstructorListCardGird source="instructor" />
  </List>
)

export default InstructorsList
