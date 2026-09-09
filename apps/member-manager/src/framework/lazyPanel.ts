import { ComponentType, lazy } from 'react';
import type { LazyPanel } from './manifest';

/**
 * `panel: lazyPanel(() => import('./ApplicationsPanel'))`
 *
 * React.lazy for the tab panel plus the raw loader so `setTab()` / tab hover
 * can kick the chunk download in parallel with the data prefetch.
 */
export const lazyPanel = <T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>
): LazyPanel => {
  let pending: Promise<{ default: T }> | null = null;
  const preload = () => (pending ??= loader());
  return { component: lazy(preload), preload };
};

export default lazyPanel;
