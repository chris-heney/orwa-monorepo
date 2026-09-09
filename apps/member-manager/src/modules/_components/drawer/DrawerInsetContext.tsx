import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

/**
 * Lets open right drawers push the page content aside (MUI "persistent
 * drawer" behaviour) instead of covering the heading bar's right-most icons
 * (Back, Edit, Filters…). The layout mounts the provider around the content
 * area and applies `inset` as right padding; every `RightDrawer` registers
 * its width while open. Without a provider registration is a no-op.
 */
type DrawerInsetContextValue = {
  inset: number;
  register: (id: string, width: number) => void;
  unregister: (id: string) => void;
};

const DrawerInsetContext = createContext<DrawerInsetContextValue | undefined>(
  undefined
);

export const DrawerInsetProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<Record<string, number>>({});

  const register = useCallback((id: string, width: number) => {
    setOpen((prev) => (prev[id] === width ? prev : { ...prev, [id]: width }));
  }, []);

  const unregister = useCallback((id: string) => {
    setOpen((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const inset = useMemo(
    () => Object.values(open).reduce((max, w) => Math.max(max, w), 0),
    [open]
  );

  const value = useMemo(
    () => ({ inset, register, unregister }),
    [inset, register, unregister]
  );

  return (
    <DrawerInsetContext.Provider value={value}>
      {children}
    </DrawerInsetContext.Provider>
  );
};

/** Current right inset (px) the layout should reserve for open drawers. */
export const useDrawerInset = () => useContext(DrawerInsetContext)?.inset ?? 0;

/** Called by RightDrawer: reserve `width` px while `active`. */
export const useRegisterDrawerInset = (active: boolean, width: number) => {
  const ctx = useContext(DrawerInsetContext);
  const id = useId();
  const register = ctx?.register;
  const unregister = ctx?.unregister;

  useEffect(() => {
    if (!register || !unregister) return;
    if (active) register(id, width);
    else unregister(id);
    return () => unregister(id);
  }, [active, width, id, register, unregister]);
};

export default DrawerInsetContext;
