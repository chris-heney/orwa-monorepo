import { alpha, createTheme, ThemeOptions } from '@mui/material'
import { deepmerge } from '@mui/utils'
import { defaultDarkTheme, defaultLightTheme, RaThemeOptions } from 'react-admin'

/**
 * Shared dark/light theme overrides for member-manager.
 * Prefer theme-level fixes here so list pages, tabs, and chips stay readable
 * without per-page hardcoding.
 */
const sharedComponentOverrides: ThemeOptions['components'] = {
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        opacity: 1,
        color:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.78)
            : alpha(theme.palette.common.black, 0.7),
        '&.Mui-selected': {
          color: theme.palette.primary.main,
          opacity: 1,
        },
        '&.Mui-disabled': {
          color:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.38)
              : theme.palette.text.disabled,
          opacity: 1,
        },
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.grey[100],
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        // Outlined chips inherit low-contrast secondary text in dark mode
        ...(theme.palette.mode === 'dark'
          ? {
              '&.MuiChip-outlined': {
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
              },
            }
          : {}),
      }),
    },
  },
  // @ts-expect-error RaDatagrid is a react-admin component slot
  RaDatagrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .RaDatagrid-rowOdd': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.06)
              : '#eeeeee',
        },
        '& .RaDatagrid-row:hover': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.1)
              : undefined,
        },
        '& .RaDatagrid-headerCell, & .RaDatagrid-rowCell': {
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
        },
        '& tr th, & tr td': {
          borderColor: theme.palette.divider,
        },
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-selected': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.24)
              : undefined,
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
        '&.MuiTableCell-paddingCheckbox': {
          padding: '0 8px 0 8px',
        },
      }),
      head: ({ theme }) => ({
        color: theme.palette.text.primary,
        fontWeight: 600,
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.text.secondary
            : undefined,
        '&.Mui-focused': {
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.main
              : undefined,
        },
      }),
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.text.secondary
            : undefined,
      }),
    },
  },
}

const lightExtras: RaThemeOptions = {
  components: {
    ...sharedComponentOverrides,
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          '&$disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
}

const darkExtras: RaThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#313131',
      paper: '#3a3a3a',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.92)',
      secondary: 'rgba(255, 255, 255, 0.72)',
      disabled: 'rgba(255, 255, 255, 0.45)',
    },
    divider: 'rgba(255, 255, 255, 0.16)',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(144, 202, 249, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  components: sharedComponentOverrides,
}

export const lightTheme: RaThemeOptions = deepmerge(
  defaultLightTheme,
  lightExtras
)

export const darkTheme: RaThemeOptions = deepmerge(defaultDarkTheme, darkExtras)

/** Ensure themes are fully resolved for any non-Admin ThemeProvider usages */
export const resolvedLightTheme = createTheme(lightTheme)
export const resolvedDarkTheme = createTheme(darkTheme)
