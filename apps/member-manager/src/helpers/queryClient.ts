import { QueryClient } from "react-query";

/**
 * Shared react-query (v3) client for member-manager.
 * RA 4 / ra-core still use `react-query` v3 — not `@tanstack/react-query` v5.
 * Passing a v5 QueryClient throws: defaultQueryObserverOptions is not a function.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      cacheTime: 10 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default queryClient;
