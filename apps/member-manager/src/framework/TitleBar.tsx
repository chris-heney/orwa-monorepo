import React, { ReactNode, useMemo, useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PageHeadingBar from '../modules/_components/PageHeadingBar';
import HeadingAction from '../modules/_components/heading/HeadingAction';
import RecordCount from '../modules/_components/RecordCount';
import type { ActionManifest, PageCtx, TitleBarApi } from './manifest';
import { usePageCtx, usePageManifest, useTitleBar } from './PageContext';
import { HEADING_ACTION_SIZE, MAX_BAR_ACTIONS } from './layoutTokens';
import { actionsFor } from './Drawers';

const resolve = <T,>(
  value: T | ((ctx: PageCtx) => T) | undefined,
  ctx: PageCtx
): T | undefined =>
  typeof value === 'function' ? (value as (c: PageCtx) => T)(ctx) : value;

/** Which manifest actions are shown for the current ctx, sorted. */
export const visibleActions = (
  actions: ActionManifest[],
  ctx: PageCtx,
  hasList: boolean
): ActionManifest[] =>
  actions
    .filter((a) => (a.can ? ctx.can(a.can[0], a.can[1]) : true))
    .filter((a) => (a.visible ? a.visible(ctx) : true))
    .filter((a) => a.scope !== 'selection' || ctx.selectedIds.length > 0)
    .filter((a) => a.scope !== 'record' || ctx.focus?.kind === 'record')
    .filter((a) => hasList || !a.requiresList)
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));

const ActionButton = ({
  action,
  ctx,
  api,
  searchOpen,
}: {
  action: ActionManifest;
  ctx: PageCtx;
  api: TitleBarApi;
  searchOpen: boolean;
}) => {
  if (action.component) {
    const Component = action.component;
    return <Component ctx={ctx} api={api} />;
  }
  const Icon = action.icon;
  const active = action.togglesDrawer
    ? api.isDrawerOpen(action.togglesDrawer)
    : action.togglesSearch
    ? searchOpen
    : undefined;
  return (
    <HeadingAction
      icon={<Icon fontSize="small" />}
      label={action.label}
      active={active}
      forceLabel={action.forceLabel}
      color={action.color}
      data-testid={`heading-action-${action.id}`}
      onClick={() => {
        if (action.togglesDrawer) api.toggleDrawer(action.togglesDrawer);
        else if (action.togglesSearch) api.toggleSearch();
        action.onClick?.(ctx, api);
      }}
    />
  );
};

const OverflowMenu = ({
  actions,
  ctx,
  api,
}: {
  actions: ActionManifest[];
  ctx: PageCtx;
  api: TitleBarApi;
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <Tooltip title="More actions">
        <IconButton
          size="small"
          aria-label="More actions"
          aria-haspopup="menu"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{
            color: (theme) => theme.palette.headingBar.fg,
            width: HEADING_ACTION_SIZE,
            height: HEADING_ACTION_SIZE,
            borderRadius: 1,
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <MenuItem
              key={a.id}
              onClick={() => {
                setAnchor(null);
                if (a.togglesDrawer) api.toggleDrawer(a.togglesDrawer);
                else if (a.togglesSearch) api.toggleSearch();
                a.onClick?.(ctx, api);
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{a.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

const SelectionCount = ({ count }: { count: number }) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <Typography
      fontSize={isSmall ? '12px' : undefined}
      variant="button"
      sx={{ color: (theme) => theme.palette.headingBar.fg }}
    >
      {count} selected
    </Typography>
  );
};

interface TitleBarProps {
  searchOpen: boolean;
  hasList: boolean;
}

/**
 * The heading bar, fed by manifests: title (page/tab), ⓘ, record count or
 * "N selected", RBAC-filtered actions (page ∪ tab, sorted), overflow menu,
 * Back far-right. Presentation is `PageHeadingBar`; nothing here sets margins.
 */
export const TitleBar = ({ searchOpen, hasList }: TitleBarProps) => {
  const { page, tab, tabs } = usePageManifest();
  const ctx = usePageCtx();
  const api = useTitleBar();

  const title: ReactNode = useMemo(() => {
    const tabTitle = resolve(tab?.title, ctx);
    if (tabTitle !== undefined) return tabTitle;
    const pageTitle = resolve(page.titleBar.title, ctx);
    if (tab && tabs.length > 0 && !ctx.isSmall) {
      return (
        <>
          {pageTitle}
          {' : '}
          {tab.label}
        </>
      );
    }
    return pageTitle;
  }, [tab, tabs.length, page.titleBar.title, ctx]);

  const actions = useMemo(
    () => visibleActions(actionsFor(page, tab), ctx, hasList),
    [page, tab, ctx, hasList]
  );

  const explicitOverflow = actions.filter((a) => a.placement === 'overflow');
  let bar = actions.filter((a) => a.placement !== 'overflow');
  let overflow = explicitOverflow;
  if (bar.length > MAX_BAR_ACTIONS) {
    overflow = [...bar.slice(MAX_BAR_ACTIONS - 1), ...explicitOverflow];
    bar = bar.slice(0, MAX_BAR_ACTIONS - 1);
  }

  const showCount =
    hasList &&
    (tabs.length > 0 || page.titleBar.showCount !== false) &&
    (tab?.list?.selectionCount !== false);

  const back = resolve(page.titleBar.back, ctx);

  return (
    <PageHeadingBar
      title={title}
      info={page.titleBar.infoTooltip}
      backLabel={page.titleBar.backLabel}
      onBack={back !== undefined ? () => api.navigate(back) : undefined}
      actions={
        <>
          {showCount ? (
            ctx.selectedIds.length > 0 ? (
              <SelectionCount count={ctx.selectedIds.length} />
            ) : (
              <RecordCount />
            )
          ) : null}
          {bar.map((a) => (
            <ActionButton
              key={a.id}
              action={a}
              ctx={ctx}
              api={api}
              searchOpen={searchOpen}
            />
          ))}
          {overflow.length > 0 ? (
            <OverflowMenu actions={overflow} ctx={ctx} api={api} />
          ) : null}
        </>
      }
    />
  );
};

export default TitleBar;
