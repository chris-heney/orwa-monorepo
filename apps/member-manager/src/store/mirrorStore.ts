import { Store, localStorageStore } from 'react-admin';
import { config } from '../config';

type Json = Record<string, any>;

export const createMirrorStore = (namespace = 'Config'): Store => {
    
  const base = localStorageStore(undefined, namespace) as unknown as Store;
  const apiBase = config.VITE_API_URL.replace('/api/v1', '');
  const prefix = `RaStore${namespace}.`;

  let saveTimer: number | undefined;

  const collectNamespace = (): Json => {
    const out: Json = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const subKey = key.substring(prefix.length);
      try {
        out[subKey] = JSON.parse(localStorage.getItem(key) as string);
      } catch {
        // non-JSON; fallback raw
        out[subKey] = localStorage.getItem(key);
      }
    }
    return out;
  };

  const saveRemote = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) return; // no-op if not authenticated
      const prefs = collectNamespace();
      await fetch(`${apiBase}/auth/me/preferences`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: { [namespace]: prefs } }),
      });
    } catch {
      // ignore
    }
  };

  const scheduleSave = () => {
    const token = localStorage.getItem('token') || '';
    if (!token) return;
    if (saveTimer) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      saveRemote();
    }, 400);
  };

  const seedFromRemote = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) return;
      const res = await fetch(`${apiBase}/auth/me/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const body = await res.json();
      const remote = (body?.preferences?.[namespace] || {}) as Json;
      Object.entries(remote).forEach(([k, v]) => {
        try { base.setItem(k, v as any); } catch {}
      });
    } catch {
      // ignore
    }
  };

  // Enhance base store methods to mirror to server
  const originalSet = base.setItem.bind(base);
  const originalRemove = base.removeItem.bind(base);
  const originalRemoveItems = (base as any).removeItems?.bind(base);
  const originalReset = (base as any).reset?.bind(base);
  const originalSetup = (base as any).setup?.bind(base);

  const store: any = {
    ...base,
    setup() {
      originalSetup && originalSetup();
      // seed local from remote on startup
      // Only attempt remote seed when authenticated
      const token = localStorage.getItem('token') || '';
      if (!token) return;
      seedFromRemote();
    },
    setItem<T = any>(key: string, value: T): void {
      originalSet(key, value);
      scheduleSave();
    },
    removeItem(key: string): void {
      originalRemove(key);
      scheduleSave();
    },
    removeItems(keys: string[]): void {
      if (originalRemoveItems) originalRemoveItems(keys);
      else keys.forEach(k => originalRemove(k));
      scheduleSave();
    },
    reset(): void {
      if (originalReset) originalReset();
      scheduleSave();
    },
  };

  return store as Store;
};


