import React, { ReactNode } from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

type AuthPageShellProps = {
  children: ReactNode
}

/** Full-viewport shell so auth pages respect dark/light background. */
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
  </>
)

export default AuthPageShell
