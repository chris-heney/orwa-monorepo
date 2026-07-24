import type { SxProps, Theme } from '@mui/material'
import getContrastColor from './getContrastColor'

type HEX = `#${string}`

/**
 * sx for status/filter surfaces that use a fixed (often neon) background.
 * Picks black/white label ink via contrast so dark mode never inherits pale text.
 */
const coloredSurfaceSx = (
  backgroundColor: string,
  extras: SxProps<Theme> = {}
): SxProps<Theme> => {
  const bg = (
    backgroundColor?.startsWith('#')
      ? backgroundColor
      : `#${backgroundColor || 'cccccc'}`
  ) as HEX

  return {
    backgroundColor: bg,
    color: getContrastColor(bg),
    // Ensure nested Typography / FormControlLabel / Radio inherit contrast ink
    '& .MuiFormControlLabel-label, & .MuiTypography-root': {
      color: 'inherit',
    },
    '& .MuiRadio-root, & .MuiRadio-root.Mui-checked': {
      color: 'inherit',
    },
    ...extras,
  }
}

export default coloredSurfaceSx
