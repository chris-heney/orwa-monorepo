import React, { ReactNode } from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { Notification } from 'react-admin'

type AuthPageShellProps = {
  children: ReactNode
}

/**
 * Full-viewport shell so auth pages respect dark/light background.
 *
 * Custom auth pages render OUTSIDE react-admin's Layout, which is what
 * normally mounts the toast outlet — without <Notification /> here, every
 * notify() on login/reset pages (e.g. "Invalid identifier or password") is
 * silently dropped and a failed login looks like nothing happened.
 */
const AuthPageShell = ({ children }: AuthPageShellProps) => (
  <>
    <CssBaseline />
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
        py: 4,
      }}
    >
      {children}
    </Box>
    <Notification />
  </>
)

export default AuthPageShell
