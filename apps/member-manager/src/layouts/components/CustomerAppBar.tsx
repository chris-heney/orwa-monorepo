import React, { memo } from 'react'
import { AppBar, InspectorButton } from 'react-admin'
import { Typography } from '@mui/material'

const AgentAppBar = memo(props => (
  <AppBar {...props}>
    <Typography flex="1" variant="h6" id="react-admin-title" />
    <InspectorButton />
  </AppBar>
))

AgentAppBar.displayName = 'CustomeAppBar'

export default AgentAppBar
