import { useCallback } from 'react';
import { useStore } from 'react-admin';

/**
 * Open-state for a set of mutually exclusive right drawers on one page
 * (e.g. show page: "notifications" | "activity"; dashboard: "filters" |
 * "activity"). At most one drawer in the group is open.
 *
 * Persisted in RaStore under `storeKey` — the same mechanism the list filter
 * drawers use — so it survives navigation and syncs with user preferences.
 */
export const useDrawerGroup = <N extends string>(
  storeKey: string,
  defaultActive: N | null = null
) => {
  const [active, setActive] = useStore<N | null>(storeKey, defaultActive);

  const open = useCallback((name: N) => setActive(name), [setActive]);
  const close = useCallback(() => setActive(null), [setActive]);
  const toggle = useCallback(
    (name: N) => setActive(active === name ? null : name),
    [active, setActive]
  );
  const isOpen = useCallback((name: N) => active === name, [active]);

  return { active, isOpen, open, close, toggle };
};

export default useDrawerGroup;
