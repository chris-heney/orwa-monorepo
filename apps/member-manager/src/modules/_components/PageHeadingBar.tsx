import React, { MouseEventHandler, ReactNode } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TopToolbar from './CustomToptoolBar';
import { BackAction } from './heading/HeadingActions';
import {
  HEADING_BAR_LEFT_GUTTER,
  HEADING_BAR_MIN_HEIGHT,
  HEADING_BAR_PY,
  HEADING_BAR_RIGHT_GUTTER,
} from '../../framework/layoutTokens';
import { HEADING_BAR_PALETTE } from '../../framework/themeTokens';

// Re-exported for legacy call sites; the numbers live in framework/layoutTokens.
export {
  HEADING_BAR_LEFT_GUTTER,
  HEADING_BAR_MIN_HEIGHT,
  HEADING_BAR_RIGHT_GUTTER,
};
/** @deprecated read `theme.palette.headingBar.bg` */
export const HEADING_BAR_BG = HEADING_BAR_PALETTE.bg;

type PageHeadingBarProps = {
  title: ReactNode;
  /** Shown on the info (i) tooltip next to the title */
  info?: string;
  /** Right-side actions — use the `HeadingAction` presets (32px icon buttons). */
  actions?: ReactNode;
  /**
   * Show/edit pages: renders the Back arrow as the RIGHT-MOST action.
   * Back is never placed on the left.
   */
  onBack?: MouseEventHandler<HTMLButtonElement>;
  backLabel?: string;
  /** Click handler for the title text (e.g. hidden dev toggles). */
  onTitleClick?: MouseEventHandler<HTMLElement>;
  /** Extra styles merged onto the bar, e.g. a sticky `top` offset. */
  sx?: SxProps<Theme>;
};

/**
 * THE grey/black page sub-heading bar — sticky, flush on the content, square
 * corners, identical height / padding / icon size in every module.
 *
 * Decides three things so callers cannot drift: title (left), right actions
 * (32px `HeadingAction`s, right edge aligned with the app bar's account icon)
 * and Back placement (right-most, via `onBack`).
 */
const PageHeadingBar = ({
  title,
  info,
  actions,
  onBack,
  backLabel,
  onTitleClick,
  sx,
}: PageHeadingBarProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const hasActions = Boolean(actions) || Boolean(onBack);

  return (
    <Box
      className="page-heading-bar"
      sx={[
        {
          // NOTE: `top: 0`, not the app-bar height — many pages render the bar
          // inside an `overflow: hidden` Card, where a positive offset pushes
          // the bar down inside the card (a 48px gap above it).
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          backgroundColor: (theme) => theme.palette.headingBar.bg,
          color: (theme) => theme.palette.headingBar.fg,
          pl: `${HEADING_BAR_LEFT_GUTTER}px`,
          // Right gutter is carried by `.heading-actions` (see below) so it
          // holds when the sticky toolbar pins to the viewport edge on
          // pages wider than the window (large datagrids).
          pr: 0,
          py: `${HEADING_BAR_PY}px`,
          minHeight: HEADING_BAR_MIN_HEIGHT,
          boxSizing: 'border-box',
          m: 0,
          borderRadius: 0,
          width: '100%',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        // Callers must not re-introduce a gutter under the bar.
        { mt: 0, mb: 0, mx: 0, borderRadius: 0 },
      ]}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}
      >
        <Typography
          variant="h6"
          component="h1"
          onClick={onTitleClick}
          sx={{
            fontSize: isSmall ? '0.75rem' : undefined,
            color: 'inherit',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 1.25,
            cursor: onTitleClick ? 'pointer' : undefined,
          }}
        >
          {title}
        </Typography>
        {info ? (
          <Tooltip title={info} placement="bottom-start" arrow>
            <IconButton
              size="small"
              aria-label="About this page"
              sx={{
                color: (theme) => theme.palette.headingBar.muted,
                p: 0.5,
                '&:hover': { color: (theme) => theme.palette.headingBar.fg },
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      {hasActions ? (
        <TopToolbar>
          <Box
            className="heading-actions"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              mr: `${HEADING_BAR_RIGHT_GUTTER}px`,
              // Anything a module drops in here (RA buttons, counts) sits on
              // the same vertical centre as the 32px HeadingActions.
              '& > *': { display: 'inline-flex', alignItems: 'center' },
            }}
          >
            {actions}
            {onBack ? <BackAction onClick={onBack} label={backLabel} /> : null}
          </Box>
        </TopToolbar>
      ) : null}
    </Box>
  );
};

export default PageHeadingBar;
