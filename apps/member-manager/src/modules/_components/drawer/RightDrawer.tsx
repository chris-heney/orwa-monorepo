import React, { ReactNode, useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { SxProps } from '@mui/material/styles';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import { DrawerContextProvider, DrawerContextValue } from './DrawerContext';
import { useRegisterDrawerInset } from './DrawerInsetContext';

/** Height of the fixed black app bar — drawers start directly under it. */
export const RIGHT_DRAWER_TOP_OFFSET = 48;
export const RIGHT_DRAWER_WIDTH = 320;

export type RightDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Header text, e.g. "Filters", "Notifications", "Activity Feed". */
  title: ReactNode;
  /** Small icon rendered before the title. */
  icon?: ReactNode;
  /** Extra header buttons (rendered before the collapse control). */
  headerActions?: ReactNode;
  /** What this drawer is about — see DrawerContext. Exposed via useDrawerContext(). */
  context?: DrawerContextValue;
  width?: number;
  topOffset?: number;
  /** When true (default), drawer never opens below the `sm` breakpoint. */
  hideOnSmall?: boolean;
  closeLabel?: string;
  /** Styles for the scrolling body (default: no padding — bodies pad themselves). */
  bodySx?: SxProps<Theme>;
  children: ReactNode;
};

/**
 * THE right-side drawer for member-manager.
 *
 * Persistent (renders inline — react-admin Record/List contexts flow through),
 * anchored right, pinned under the app bar, black header with a collapse
 * chevron. Filter drawers (`FilterSidebarShell`) and record drawers
 * (Notifications, Activity Feed, …) are all this component, so every drawer
 * looks and behaves the same. Context flows in through the single `context`
 * prop; bodies read it with `useDrawerContext()` / `useRecordDrawerContext()`.
 */
const RightDrawer = ({
  open,
  onClose,
  title,
  icon,
  headerActions,
  context,
  width = RIGHT_DRAWER_WIDTH,
  topOffset = RIGHT_DRAWER_TOP_OFFSET,
  hideOnSmall = true,
  closeLabel = 'Close panel',
  bodySx,
  children,
}: RightDrawerProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const visible = open && !(hideOnSmall && isSmall);

  // A persistent Drawer keeps its children mounted while closed, which would
  // make every closed drawer body fetch on page load. Mount the body only
  // while the drawer is open (kept through the slide-out so it does not blank
  // mid-animation).
  const [bodyMounted, setBodyMounted] = useState(visible);
  useEffect(() => {
    if (visible) setBodyMounted(true);
  }, [visible]);

  // Push the page content aside so heading-bar actions stay reachable.
  useRegisterDrawerInset(visible, width);

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={visible}
      SlideProps={{ onExited: () => setBodyMounted(false) }}
      sx={{
        '& .MuiDrawer-paper': {
          width,
          top: topOffset,
          height: `calc(100% - ${topOffset}px)`,
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: '-8px 0 24px rgba(0,0,0,0.18)',
          backgroundImage: 'none',
          bgcolor: 'background.paper',
          color: 'text.primary',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          minHeight: 48,
          bgcolor: 'common.black',
          color: 'common.white',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {icon}
          <Typography sx={{ fontWeight: 600 }} noWrap>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {headerActions}
          <Tooltip title={closeLabel}>
            <IconButton
              size="small"
              sx={{ color: 'common.white' }}
              onClick={onClose}
              aria-label={closeLabel}
            >
              <KeyboardDoubleArrowRightRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        sx={[
          { overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' },
          ...(Array.isArray(bodySx) ? bodySx : bodySx ? [bodySx] : []),
        ]}
      >
        <DrawerContextProvider value={context}>
          {bodyMounted ? children : null}
        </DrawerContextProvider>
      </Box>
    </Drawer>
  );
};

export default RightDrawer;
