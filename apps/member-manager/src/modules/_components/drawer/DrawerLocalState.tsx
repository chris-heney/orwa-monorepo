import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type Bag = Record<string, unknown>;

const DrawerLocalStateContext = createContext<{
  state: Bag;
  set: (key: string, value: unknown) => void;
} | null>(null);

/**
 * Ephemeral state shared between a drawer's header actions and its body
 * (they render in different subtrees). Not persisted — use RaStore for that.
 */
export const DrawerLocalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Bag>({});
  const set = useCallback(
    (key: string, value: unknown) => setState((s) => ({ ...s, [key]: value })),
    []
  );
  const value = useMemo(() => ({ state, set }), [state, set]);
  return (
    <DrawerLocalStateContext.Provider value={value}>
      {children}
    </DrawerLocalStateContext.Provider>
  );
};

/** `const [saving, setSaving] = useDrawerFlag('savingQuery')` */
export const useDrawerFlag = (
  key: string,
  fallback = false
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const ctx = useContext(DrawerLocalStateContext);
  // Outside a drawer: behave like plain component state.
  const [local, setLocal] = useState(fallback);
  if (!ctx) return [local, setLocal];
  const current = (ctx.state[key] as boolean | undefined) ?? fallback;
  const set: React.Dispatch<React.SetStateAction<boolean>> = (next) =>
    ctx.set(key, typeof next === 'function' ? next(current) : next);
  return [current, set];
};
