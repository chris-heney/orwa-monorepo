import type { Theme } from '@mui/material/styles'
import { alpha, SxProps } from '@mui/material'

/**
 * Shared Datagrid zebra / border styles.
 * Odd rows must stay dark in dark mode (never hardcode light greys).
 */
export const customDatagridStyle: SxProps<Theme> = {
  '& .RaDatagrid-rowOdd': {
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.06)
        : '#eeeeee',
  },
  '& .RaDatagrid-row:hover': {
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.1)
        : undefined,
  },
  '& .RaDatagrid-rowOdd:hover': {
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.12)
        : undefined,
  },
  '& .css-19tabqp-RaBulkActionsToolbar-root .RaBulkActionsToolbar-toolbar': {
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  '& .css-uw9l4c .RaBulkActionsToolbar-toolbar': {
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  '& .RaDatagrid-thead': {
    whiteSpace: 'nowrap',
  },
  '& .RaDatagrid-headerCell, & .RaDatagrid-rowCell': {
    color: (theme) => theme.palette.text.primary,
  },
  'tr th': {
    py: 1,
    border: (theme) => `1px solid ${theme.palette.divider}`,
  },
  'tr td': {
    py: 0.5,
    border: (theme) => `1px solid ${theme.palette.divider}`,
  },
}

export const positionStickyComponent = {
  maxWidth: '75vw',
  display: 'block',
  position: 'sticky',
  left: 0,
  pl: 4,
}
