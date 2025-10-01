import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface ActivityFeedHeaderProps {
  setDisplaySearch: React.Dispatch<React.SetStateAction<boolean>>
  admin?: boolean
  sx?: React.CSSProperties
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const ActivityFeedHeader = ({ setDisplaySearch, admin = false, sx, variant }: ActivityFeedHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "background.default",
        px: 1,
      }}
    >
      <Typography
        variant={variant || 'h6'}
        sx={{
          alignItems: 'center',
          color: 'text.primary',
          flexGrow: 1,
          p: .5,
          ml: 1,
          ...sx,
        }}
      >
        Activity Feed
      </Typography>

      {admin && <IconButton
        color="inherit"
        onClick={() => setDisplaySearch((prev) => !prev)}
      >
        <SearchIcon color="inherit" />
      </IconButton>}
    </Box>
  )
}

export default ActivityFeedHeader