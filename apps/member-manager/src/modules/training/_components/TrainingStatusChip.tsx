import React from 'react'
import { Chip, useTheme } from '@mui/material'
import { STAGE_META, TrainingStatus } from '../workflow'

type TrainingStatusChipProps = {
  status?: string
  size?: 'small' | 'medium'
}

/** Color-coded pipeline stage chip, legible in light and dark themes. */
const TrainingStatusChip = ({ status, size = 'small' }: TrainingStatusChipProps) => {
  const theme = useTheme()
  const meta = STAGE_META[status as TrainingStatus]
  if (!meta) return null

  const dark = theme.palette.mode === 'dark'
  return (
    <Chip
      label={meta.label}
      size={size}
      sx={{
        backgroundColor: dark ? meta.chip.darkBg : meta.chip.bg,
        color: dark ? meta.chip.darkFg : meta.chip.fg,
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        fontSize: size === 'small' ? '0.68rem' : undefined,
      }}
    />
  )
}

export default TrainingStatusChip
