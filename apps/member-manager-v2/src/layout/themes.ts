import { alpha, Theme, createTheme } from '@mui/material';
import createPalette from '@mui/material/styles/createPalette';
import { grey } from '@mui/material/colors';
import { RaThemeOptions } from 'react-admin';

const defaultThemeInvariants = {
    MuiAutocomplete: {
        defaultProps: {
            fullWidth: true,
        },
        variants: [
            {
                props: {},
                style: ({ theme }: { theme: Theme }) => ({
                    [theme.breakpoints.down('sm')]: { width: '100%' },
                }),
            },
        ],
    },
    MuiTextField: {
        defaultProps: {
            variant: 'filled' as const,
            margin: 'dense' as const,
            size: 'small' as const,
            fullWidth: true,
        },
        variants: [
            {
                props: {},
                style: ({ theme }: { theme: Theme }) => ({
                    [theme.breakpoints.down('sm')]: { width: '100%' },
                }),
            },
        ],
    },
    MuiFormControl: {
        defaultProps: {
            variant: 'filled' as const,
            margin: 'dense' as const,
            size: 'small' as const,
            fullWidth: true,
        },
    },
    RaSimpleFormIterator: {
        defaultProps: {
            fullWidth: true,
        },
    },
    RaTranslatableInputs: {
        defaultProps: {
            fullWidth: true,
        },
    },
};

const darkComponentsOverrides = (theme: Theme) => ({
    ...defaultThemeInvariants,
    RaLayout: {
        styleOverrides: {
            root: {
                '& .RaLayout-content': {
                    padding: `${theme.spacing(1)}`,
                    [theme.breakpoints.up('md')]: {
                        padding: `${theme.spacing(2)}`,
                    },
                },
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                // Hide MenuItemCategory shadow behind the appbar
                zIndex: 9999,
            },
        },
    },
    RaAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: darkPalette.background.paper, // Dark blue-gray
                color: '#fff',
                borderBottom: `1px solid ${darkPalette.primary.main}`, // Blue accent line
                '& .RaAppBar-menuButton': {
                    // Since sub-<Menu /> hide labels when sidebar is closed
                    // We need to disallow sidebar closing on desktop (hiding button is simpler)
                    display: 'block',
                    [theme.breakpoints.up('md')]: {
                        display: 'none',
                    },
                },
            },
        },
    },
    RaSearchInput: {
        styleOverrides: {
            root: {
                color: darkPalette.common.white,
                backgroundColor: alpha(darkPalette.common.black, 0.04),
                '&:hover': {
                    backgroundColor: alpha(darkPalette.common.black, 0.13),
                },
                '&:focus': {
                    backgroundColor: alpha(darkPalette.common.black, 0.13),
                },
                '&:focus-within': {
                    backgroundColor: alpha(darkPalette.common.black, 0.13),
                },
                '& .RaSearchInput-inputBase': {
                    background: alpha(darkPalette.common.black, 0.04),
                    '&:hover': {
                        background: alpha(darkPalette.common.black, 0.1),
                    },
                },
                '& .RaSearchInput-inputAdornmentStart': {
                    color: darkPalette.common.white,
                },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                border: 'none',
                background: darkPalette.background.paper,
            },
        },
    },
});

const darkPalette = createPalette({
    mode: 'dark', // Switching the dark mode on is a single property value change.
    primary: {
        dark: '#1565C0',   // Darker blue
        main: '#2196F3',   // ORWA primary blue
        light: '#42A5F5',  // Lighter blue
        contrastText: '#fff',
    },
    secondary: {
        dark: '#455A64',   // Dark blue-gray
        main: '#607D8B',   // Blue-gray
        light: '#78909C',  // Light blue-gray
        contrastText: '#fff',
    },
    background: {
        paper: '#1a2332',  // Dark blue-gray paper
        default: '#0f1419', // Very dark blue-black
    },
    info: {
        main: '#0288D1',   // Info blue
    },
    success: {
        main: '#5cb85c',   // Green for success states
    },
});

const lightComponentsOverrides = (theme: Theme) => ({
    ...defaultThemeInvariants,
    RaLayout: {
        styleOverrides: {
            root: {
                '& .RaLayout-content': {
                    padding: `${theme.spacing(1)}`,
                    [theme.breakpoints.up('md')]: {
                        padding: `${theme.spacing(2)}`,
                    },
                },
            },
        },
    },
    RaAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: '#fff',
                color: lightPalette.text.primary,
                borderBottom: `2px solid ${lightPalette.primary.main}`, // Blue accent
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                '& .RaAppBar-menuButton': {
                    // Since sub-<Menu /> hide labels when sidebar is closed
                    // We need to disallow sidebar closing on desktop (hiding button is simpler)
                    display: 'block',
                    [theme.breakpoints.up('md')]: {
                        display: 'none',
                    },
                },
                '& .RaAppBar-title': {
                    color: lightPalette.primary.dark, // Dark blue for title
                    fontWeight: 600,
                },
            },
        },
    },
    RaSearchInput: {
        styleOverrides: {
            root: {
                color: lightPalette.text.primary,
                backgroundColor: alpha(lightPalette.common.black, 0.04),
                '&:hover': {
                    backgroundColor: alpha(lightPalette.common.black, 0.13),
                },
                '&:focus': {
                    backgroundColor: alpha(lightPalette.common.black, 0.13),
                },
                '&:focus-within': {
                    backgroundColor: alpha(lightPalette.common.black, 0.13),
                },
                '& .RaSearchInput-inputBase': {
                    borderRadius: 10,
                    background: alpha(lightPalette.common.black, 0.04),
                    '&:hover': {
                        background: alpha(lightPalette.common.black, 0.1),
                    },
                },
                '& .RaSearchInput-inputAdornmentStart': {
                    color: alpha('#000000', 0.38),
                },
            },
        },
    },
    RaMenuItemLink: {
        styleOverrides: {
            root: {
                borderLeft: '3px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: alpha(lightPalette.primary.main, 0.08),
                    borderLeft: `3px solid ${lightPalette.primary.light}`,
                },
                '& .RaMenuItemLink-active': {
                    borderLeft: `3px solid ${lightPalette.primary.main}`,
                    backgroundColor: alpha(lightPalette.primary.main, 0.05),
                    color: lightPalette.primary.dark,
                },
            },
        },
    },
    RaMenuItemCategory: {
        styleOverrides: {
            root: {
                '& .RaMenuItemCategory-container': {
                    color: '#808080',
                    '&:hover': {
                        color: 'black',
                        backgroundColor: grey[200],
                    },
                },
                '& .RaMenuItemCategory-popoverPaper': {
                    boxShadow: theme.shadows[2],
                    backgroundColor: lightPalette.background.paper,
                },
            },
        },
    },
    RaMenuItem: {
        styleOverrides: {
            root: {
                color: '#808080',
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            elevation1: {
                boxShadow: 'none',
            },
            root: {
                border: '1px solid #e0e0e3',
                backgroundClip: 'padding-box',
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            contained: {
                boxShadow: 'none',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)', // Blue shadow on hover
                },
            },
            containedPrimary: {
                backgroundColor: lightPalette.primary.main,
                '&:hover': {
                    backgroundColor: lightPalette.primary.dark,
                },
            },
            containedSecondary: {
                backgroundColor: lightPalette.secondary.main,
                color: '#fff',
                '&:hover': {
                    backgroundColor: lightPalette.secondary.dark,
                },
            },
            outlined: {
                borderWidth: 2,
                '&:hover': {
                    borderWidth: 2,
                    backgroundColor: alpha(lightPalette.primary.main, 0.04),
                },
            },
            text: {
                '&:hover': {
                    backgroundColor: alpha(lightPalette.primary.main, 0.04),
                },
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            // Hide MenuItemCategory shadow behind the appbar
            root: { zIndex: 9999 },
            colorSecondary: {
                color: '#808080',
                backgroundColor: '#fff',
            },
        },
    },
    MuiLinearProgress: {
        styleOverrides: {
            colorPrimary: {
                backgroundColor: '#f5f5f5',
            },
            barColorPrimary: {
                backgroundColor: '#d7d7d7',
            },
        },
    },
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
    RaSidebar: {
        styleOverrides: {
            root: {
                '& .RaSidebar-drawerPaper': {
                    backgroundColor: '#fafafa',
                    borderRight: `1px solid ${lightPalette.divider}`,
                    boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
                },
                '& .RaSidebar-fixed': {
                    zIndex: 1200,
                    width: 240, // Wider sidebar for better navigation
                    backgroundColor: '#fafafa',
                },
                '&.MuiDrawer-docked .MuiPaper-root': {
                    width: 240,
                    backgroundColor: '#fafafa',
                    borderRight: `1px solid ${lightPalette.divider}`,
                },
            },
        },
    },
    RaLinkedData: {
        styleOverrides: {
            root: {
                '&:hover': {
                    backgroundColor: '#ddd',
                },
            },
        },
    },
});

const lightPalette = createPalette({
    mode: 'light',
    primary: {
        dark: '#1565C0',   // Darker blue
        main: '#2196F3',   // ORWA primary blue (from website header)
        light: '#64B5F6',  // Lighter blue
        contrastText: '#fff',
    },
    secondary: {
        dark: '#455A64',   // Dark gray
        main: '#607D8B',   // Blue-gray
        light: '#90A4AE',  // Light blue-gray
        contrastText: '#fff',
    },
    background: {
        paper: '#ffffff',   // Clean white
        default: '#f5f5f5', // Light gray background
    },
    text: {
        primary: '#212121',  // Almost black for main text
        secondary: '#757575', // Medium gray for secondary text
    },
    info: {
        main: '#0288D1',   // Info blue
    },
    success: {
        main: '#4CAF50',   // Green for success states
    },
    divider: '#e0e0e0',   // Light gray for borders
});

const createSoftTheme = (
    palette: RaThemeOptions['palette'],
    componentsOverrides: (theme: Theme) => Record<string, any>
) => {
    const themeOptions = {
        palette,
        shape: {
            borderRadius: 10,
        },
    };
    const theme = createTheme(themeOptions);
    theme.components = componentsOverrides(theme);
    return theme;
};

export const softLightTheme = createSoftTheme(
    lightPalette,
    lightComponentsOverrides
);
export const softDarkTheme = createSoftTheme(
    darkPalette,
    darkComponentsOverrides
);
