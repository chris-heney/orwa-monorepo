import { useStore } from "react-admin";

/**
 * Persist filter-drawer open state in RaStore (survives navigation / remount).
 * Default closed to match Grant Manager.
 */
export const usePersistedSidebarOpen = (
  storeKey: string,
  defaultOpen = false
) => {
  return useStore<boolean>(storeKey, defaultOpen);
};

export default usePersistedSidebarOpen;
