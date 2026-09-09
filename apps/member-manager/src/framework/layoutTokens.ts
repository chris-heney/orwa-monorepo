/**
 * Layout tokens — alignment as arithmetic.
 *
 * Every number the heading bar, tab strip, right drawers and app bar share
 * lives here so the "right-most heading icon sits under the app-bar account
 * icon" equation cannot silently break when one side changes.
 *
 * Verified 2026-09-09 (1440px, light + dark): bar 48px, gap above 0, right
 * icon centre-x 1412 == account icon centre-x on every migrated page.
 */

/** MUI Toolbar heights: `regular` (xs) / `dense` (sm+). */
export const APP_BAR_HEIGHT = { xs: 56, sm: 48 } as const;
/** react-admin AppBar toolbar is `disableGutters`; MUI IconButton medium = 8px padding. */
export const APP_BAR_TOOLBAR_PX = 8;
/** IconButton medium footprint in the black app bar. */
export const APP_BAR_ICON_SIZE = 40;

/** Icon-only heading action footprint: 20px glyph + 6px padding (heading/HeadingAction.tsx). */
export const HEADING_ACTION_SIZE = 32;
export const HEADING_ACTION_GAP = 6;
export const HEADING_BAR_MIN_HEIGHT = 48;
export const HEADING_BAR_PX = 12;
/**
 * Vertical padding of the bar. The proposal document said 6px; the shipped
 * bar uses 8px (`py: 1`) and — because `minHeight` governs — measures 48px
 * either way. 8px is kept so a two-line wrapped title still breathes.
 */
export const HEADING_BAR_PY = 8;

/**
 * Right gutter (px): the account icon's centre is `APP_BAR_TOOLBAR_PX +
 * APP_BAR_ICON_SIZE / 2` = 28px from the viewport edge; a 32px heading action
 * has its centre 16px from its right edge → 12px gutter.
 */
export const HEADING_BAR_RIGHT_GUTTER =
  APP_BAR_TOOLBAR_PX + (APP_BAR_ICON_SIZE - HEADING_ACTION_SIZE) / 2; // = 12
export const HEADING_BAR_LEFT_GUTTER = HEADING_BAR_PX;

/** Right drawers start directly under the (dense) app bar. */
export const RIGHT_DRAWER_TOP_OFFSET = APP_BAR_HEIGHT.sm; // = 48
export const RIGHT_DRAWER_WIDTH = 320;

/**
 * Sticky offset of the page heading (bar + search row + tab strip).
 *
 * react-admin's AppBar is wrapped in `HideOnScroll`: it slides out of view
 * as soon as the page scrolls down. A sticky heading offset equal to the
 * app-bar height would therefore leave a 48px hole above the bar while
 * scrolling, so the offset is `0` unless the app bar is rendered `alwaysOn`.
 * (`PageShell` owns the one sticky wrapper; pages never add their own.)
 */
export const APP_BAR_ALWAYS_ON = false;
export const STICKY_BAR_TOP = APP_BAR_ALWAYS_ON
  ? { xs: APP_BAR_HEIGHT.xs, sm: APP_BAR_HEIGHT.sm }
  : 0;

/** z-index of the sticky heading wrapper (above datagrid headers, below drawers). */
export const STICKY_BAR_Z_INDEX = 10;

/** Bar actions beyond this count fold into the "⋯" overflow menu. */
export const MAX_BAR_ACTIONS = 7;

/** Hover-intent delay before a tab prefetches its data / chunk. */
export const TAB_HOVER_PREFETCH_MS = 150;
