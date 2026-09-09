import type { PaletteOptions, ThemeOptions } from '@mui/material/styles';

/**
 * `palette.headingBar` — colours of the page heading bar, the right-drawer
 * header and heading actions. One token, read by `PageHeadingBar`,
 * `RightDrawer` and `HeadingAction`; identical in light and dark for now
 * (proposal §6.7) so a later light-mode tweak is a one-liner here.
 */
export interface HeadingBarPalette {
  /** Bar background. */
  bg: string;
  /** Title / icon colour on the bar. */
  fg: string;
  /** Secondary text on the bar (info icon, disabled actions). */
  muted: string;
  /** Background of an action in its pressed / active state (Filters open). */
  activeBg: string;
  /** Hover background of an action. */
  hoverBg: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    headingBar: HeadingBarPalette;
  }
  interface PaletteOptions {
    headingBar?: Partial<HeadingBarPalette>;
  }
}

export const HEADING_BAR_PALETTE: HeadingBarPalette = {
  bg: '#262626',
  fg: '#ffffff',
  muted: 'rgba(255,255,255,0.6)',
  activeBg: 'rgba(255,255,255,0.22)',
  hoverBg: 'rgba(255,255,255,0.12)',
};

export const headingBarPaletteOptions: PaletteOptions = {
  headingBar: HEADING_BAR_PALETTE,
};

/**
 * `@mui/lab` TabPanel defaults to 24px padding. Legacy dashboards still use
 * it while they wait for migration; the framework's PageShell never does.
 */
export const tabPanelComponentOverrides: ThemeOptions['components'] = {
  // @ts-expect-error MuiTabPanel is a @mui/lab component slot
  MuiTabPanel: {
    styleOverrides: {
      root: { padding: 0 },
    },
  },
};
