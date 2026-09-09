import React, { useRef } from 'react';
import { Box, Divider, Tab, Tabs, Theme, useMediaQuery } from '@mui/material';
import type { TabManifest } from './manifest';
import { dashboardTabListSx } from '../css/formLayout';
import { TAB_HOVER_PREFETCH_MS } from './layoutTokens';

interface TabStripProps {
  tabs: TabManifest[];
  value: string;
  onChange: (key: string) => void;
  /** Hover-intent prefetch (150ms) — makes tab switches feel instant. */
  onIntent?: (key: string) => void;
  /** Tab keys whose label should be hidden below `sm` (long strips). */
  hideLabelsOnSmall?: boolean;
}

export const tabId = (pageId: string, key: string) => `${pageId}-tab-${key}`;
export const panelId = (pageId: string, key: string) => `${pageId}-panel-${key}`;

/**
 * THE tab strip under the heading bar. Plain MUI `Tabs` (no @mui/lab
 * TabContext) — the framework owns which panel mounts, so there is no
 * `TabPanel` to forget `p: 0` on.
 */
export const TabStrip = ({
  tabs,
  value,
  onChange,
  onIntent,
  hideLabelsOnSmall = true,
}: TabStripProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const timer = useRef<number | null>(null);

  const clear = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Tabs
        value={tabs.some((t) => t.key === value) ? value : false}
        onChange={(_e, key: string) => onChange(key)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ ...dashboardTabListSx, minHeight: 48 }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.key}
              value={tab.key}
              id={tab.key}
              icon={<Icon />}
              label={isSmall && hideLabelsOnSmall ? undefined : tab.label}
              aria-label={tab.label}
              title={tab.label}
              onMouseEnter={() => {
                if (!onIntent || tab.key === value) return;
                clear();
                timer.current = window.setTimeout(
                  () => onIntent(tab.key),
                  TAB_HOVER_PREFETCH_MS
                );
              }}
              onMouseLeave={clear}
              onFocus={() => onIntent?.(tab.key)}
              sx={{
                minHeight: 48,
                ...(tab.divider
                  ? {
                      borderLeft: '2px solid',
                      borderColor: 'divider',
                    }
                  : {}),
              }}
            />
          );
        })}
      </Tabs>
      <Divider />
    </Box>
  );
};

export default TabStrip;
