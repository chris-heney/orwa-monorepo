import React from 'react';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { RightDrawer } from '../modules/_components/drawer';
import { DrawerLocalStateProvider } from '../modules/_components/drawer/DrawerLocalState';
import type {
  ActionManifest,
  DrawerManifest,
  ListManifest,
  PageManifest,
  TabManifest,
} from './manifest';
import { usePageCtx, usePageManifest, useTitleBar } from './PageContext';
import { DefaultFiltersBody, DefaultFiltersHeaderActions } from './ListScope';

export const FILTERS_DRAWER_ID = 'filters';

/** Auto-generated for any list with `filters` / `filterBody` (unless `filtersDrawer: false`). */
export const filtersDrawer: DrawerManifest = {
  id: FILTERS_DRAWER_ID,
  title: 'Filters',
  icon: TuneRoundedIcon,
  context: 'list',
  body: DefaultFiltersBody,
  headerActions: DefaultFiltersHeaderActions,
};

export const filtersAction: ActionManifest = {
  id: FILTERS_DRAWER_ID,
  label: 'Filters',
  icon: FilterAltIcon,
  scope: 'list',
  togglesDrawer: FILTERS_DRAWER_ID,
  order: 90,
};

export const listHasFilters = (list: ListManifest | undefined) =>
  Boolean(
    list &&
      list.filtersDrawer !== false &&
      (list.filters?.length || list.filterBody)
  );

/** Drawers for the current page + tab, with the Filters drawer auto-added. */
export const drawersFor = (
  page: PageManifest,
  tab: TabManifest | undefined
): DrawerManifest[] => {
  const declared = [...(page.drawers ?? []), ...(tab?.drawers ?? [])];
  const list = tab?.list ?? page.list;
  if (listHasFilters(list) && !declared.some((d) => d.id === FILTERS_DRAWER_ID)) {
    declared.push(filtersDrawer);
  }
  // Same id declared on page and tab → tab wins.
  const byId = new Map<string, DrawerManifest>();
  declared.forEach((d) => byId.set(d.id, d));
  return Array.from(byId.values());
};

/** Actions for the current page + tab, with the Filters toggle auto-added. */
export const actionsFor = (
  page: PageManifest,
  tab: TabManifest | undefined
): ActionManifest[] => {
  const declared = [...(page.actions ?? []), ...(tab?.actions ?? [])];
  const list = tab?.list ?? page.list;
  if (listHasFilters(list) && !declared.some((a) => a.id === FILTERS_DRAWER_ID)) {
    declared.push(filtersAction);
  }
  return declared;
};

/**
 * Renders one `RightDrawer` per manifest — outside any flex row, so the
 * content inset comes from `DrawerInsetProvider` alone. Bodies mount only
 * while open (RightDrawer behaviour) and receive the page focus as their
 * DrawerContext (`kind: 'list'` from ListScope, `kind: 'record'` from
 * ShowBase / EditBase).
 */
export const Drawers = () => {
  const { page, tab } = usePageManifest();
  const ctx = usePageCtx();
  const api = useTitleBar();

  return (
    <>
      {drawersFor(page, tab)
        .filter((d) => (d.visible ? d.visible(ctx) : true))
        .map((d) => {
          const Icon = d.icon;
          const Body = d.body;
          const Header = d.headerActions;
          const context =
            d.context === 'record'
              ? ctx.focus?.kind === 'record'
                ? ctx.focus
                : undefined
              : ctx.focus?.kind === 'list'
              ? ctx.focus
              : undefined;
          return (
            <DrawerLocalStateProvider key={d.id}>
              <RightDrawer
                open={api.isDrawerOpen(d.id)}
                onClose={api.closeDrawers}
                title={d.title}
                icon={<Icon fontSize="small" />}
                width={d.width}
                context={context}
                headerActions={Header ? <Header /> : undefined}
                closeLabel={d.id === FILTERS_DRAWER_ID ? 'Collapse filters' : undefined}
              >
                <Body />
              </RightDrawer>
            </DrawerLocalStateProvider>
          );
        })}
    </>
  );
};

export default Drawers;
