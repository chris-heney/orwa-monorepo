import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Bag = Record<string, unknown>;

interface Ctx {
  state: Bag;
  set: (key: string, value: unknown) => void;
}

const PageLocalStateContext = createContext<Ctx | null>(null);

/**
 * Ephemeral, page-scoped state shared between a page body and its bar
 * actions (they live in different subtrees). NOT persisted — RaStore is for
 * that. Mounted once per `PageShell`; reset on navigation.
 *
 * Typical use: a custom page body publishes `{ save, saving }` and a bar
 * action component renders the Save button from it.
 */
export const PageLocalStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<Bag>({});
  const set = useCallback((key: string, value: unknown) => {
    setState((s) => (Object.is(s[key], value) ? s : { ...s, [key]: value }));
  }, []);
  const value = useMemo(() => ({ state, set }), [state, set]);
  return (
    <PageLocalStateContext.Provider value={value}>
      {children}
    </PageLocalStateContext.Provider>
  );
};

/** Read + write one page-local value (component-state fallback outside a shell). */
export const usePageValue = <T,>(
  key: string,
  fallback: T
): [T, (next: T) => void] => {
  const ctx = useContext(PageLocalStateContext);
  const [local, setLocal] = useState<T>(fallback);
  if (!ctx) return [local, setLocal];
  const current = key in ctx.state ? (ctx.state[key] as T) : fallback;
  return [current, (next: T) => ctx.set(key, next)];
};

/**
 * Publish a (possibly changing) value from a body for the bar to read.
 * Functions are published once as a stable proxy that always calls the
 * latest render's version, so an inline handler never re-renders the page.
 */
export const usePublishPageValue = <T,>(key: string, value: T) => {
  const ctx = useContext(PageLocalStateContext);
  const set = ctx?.set;
  const latest = useRef<T>(value);
  latest.current = value;
  const isFn = typeof value === 'function';
  const proxy = useRef<unknown>(null);
  if (isFn && !proxy.current) {
    proxy.current = (...args: unknown[]) =>
      (latest.current as unknown as (...a: unknown[]) => unknown)(...args);
  }
  const published = isFn ? proxy.current : value;
  useEffect(() => {
    set?.(key, published);
  }, [set, key, published]);
  useEffect(() => () => set?.(key, undefined), [set, key]);
};
