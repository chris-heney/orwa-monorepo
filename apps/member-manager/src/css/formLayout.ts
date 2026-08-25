import type { SxProps, Theme } from '@mui/material/styles'

/**
 * Shared create / edit / show form chrome.
 *
 * Heading bars sit flush on the content (no gutter). Section cards are
 * square, full-bleed, and unshadowed — same treatment in every module.
 */

export const formSectionCardSx: SxProps<Theme> = {
  p: 2,
  m: 0,
  borderRadius: 0,
  boxShadow: 'none',
  bgcolor: 'background.paper',
  color: 'text.primary',
}

/** Email / header-inside-card variants that already pad themselves. */
export const formSectionCardFlushSx: SxProps<Theme> = {
  ...formSectionCardSx,
  p: 0,
}

/** Theme-aware tab strip under a dashboard heading bar. */
export const dashboardTabListSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? theme.palette.grey[900]
      : theme.palette.grey[100],
  overflow: 'clip',
} as const

/** RA Create / Edit / Show shell — no 1em top gutter, no rounded paper. */
export const formResourceShellSx = {
  m: 0,
  p: 0,
  '& .RaCreate-main, & .RaEdit-main, & .RaShow-main': {
    marginTop: 0,
  },
  '& .RaCreate-noActions, & .RaEdit-noActions, & .RaShow-noActions': {
    marginTop: 0,
  },
  '& .RaCreate-card, & .RaEdit-card, & .RaShow-card': {
    borderRadius: 0,
    boxShadow: 'none',
    margin: 0,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
}

const flattenFormCards = {
  borderRadius: 0,
  boxShadow: 'none',
  margin: 0,
} as const

/** Theme slots applied once so every module inherits the flush form page. */
export const formLayoutThemeOverrides = {
  RaCreate: {
    styleOverrides: {
      root: {
        '& .RaCreate-main': { marginTop: 0 },
        '& .MuiCard-root': flattenFormCards,
      },
      noActions: { marginTop: 0 },
      card: {
        ...flattenFormCards,
        overflow: 'visible',
        backgroundColor: 'transparent',
      },
    },
  },
  RaEdit: {
    styleOverrides: {
      root: {
        '& .RaEdit-main': { marginTop: 0 },
        '& .MuiCard-root': flattenFormCards,
      },
      noActions: { marginTop: 0 },
      card: {
        ...flattenFormCards,
        overflow: 'visible',
        backgroundColor: 'transparent',
      },
    },
  },
  RaShow: {
    styleOverrides: {
      root: {
        '& .RaShow-main': { marginTop: 0 },
        '& .MuiCard-root': flattenFormCards,
      },
      noActions: { marginTop: 0 },
      card: {
        ...flattenFormCards,
        overflow: 'visible',
        backgroundColor: 'transparent',
      },
    },
  },
  RaSimpleForm: {
    styleOverrides: {
      root: {
        padding: 0,
        '&:last-child': { paddingBottom: 0 },
        '& .MuiCard-root': flattenFormCards,
      },
    },
  },
}
