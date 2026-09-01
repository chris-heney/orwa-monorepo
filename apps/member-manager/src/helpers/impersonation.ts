import CookieStore from './ra-strapi-data-provider/src/CookieStore';

/**
 * Admin user-impersonation ("test as user").
 *
 * An Admin can browse the app as another user to reproduce that user's exact
 * experience (their role, their linked contact/data, their saved view
 * settings) without ever knowing their password. The server mints a real
 * session token for the target user (see api::impersonation) and logs every
 * start. This module owns the client side: stashing the Admin's own session,
 * swapping cookies to the target, and restoring on exit.
 *
 * Kept dependency-free (only cookies + sessionStorage) so it can be imported
 * by userPreferencesStore without an import cycle.
 */
export const IMPERSONATION_STORAGE_KEY = 'orwa.impersonation';
/** sessionStorage writes don't fire `storage` in the writing tab. */
export const IMPERSONATION_EVENT = 'orwa-impersonation-change';

interface SessionBackup {
  token: string | null;
  role: string | null;
  email: string | null;
  id: string | null;
}

export interface ImpersonationState {
  userId: number;
  email: string;
  username: string | null;
  roleName: string | null;
  /** The Admin's own session, restored verbatim on exit. */
  backup: SessionBackup;
}

export interface ImpersonationTarget {
  jwt: string;
  user: {
    id: number;
    username?: string | null;
    email: string;
    role?: { id: number; name: string; type: string } | null;
  };
}

/**
 * Raw stored value. Subscribers must snapshot this (a stable primitive) rather
 * than a parsed object: `useSyncExternalStore` compares snapshots with
 * `Object.is`, so returning a freshly parsed object every call re-renders
 * forever.
 */
export const getImpersonationRaw = (): string | null => {
  try {
    return sessionStorage.getItem(IMPERSONATION_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const parseImpersonation = (
  raw: string | null
): ImpersonationState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ImpersonationState>;
    if (
      typeof parsed?.userId !== 'number' ||
      !Number.isFinite(parsed.userId) ||
      typeof parsed?.email !== 'string' ||
      typeof parsed?.backup !== 'object' ||
      parsed.backup === null
    ) {
      return null;
    }
    return {
      userId: parsed.userId,
      email: parsed.email,
      username: parsed.username ?? null,
      roleName: parsed.roleName ?? null,
      backup: parsed.backup as SessionBackup,
    };
  } catch {
    return null;
  }
};

export const getImpersonation = (): ImpersonationState | null =>
  parseImpersonation(getImpersonationRaw());

/** Cheap boolean read for hot paths (e.g. preference-store push guards). */
export const isImpersonating = (): boolean => getImpersonationRaw() != null;

const notifyChange = () => {
  window.dispatchEvent(new Event(IMPERSONATION_EVENT));
};

/**
 * Swap the active session to the target user, stashing the Admin's own
 * cookies so `stopImpersonation` can restore them exactly. The caller is
 * responsible for flushing the Admin's pending preferences BEFORE this (while
 * the Admin token is still active) and reloading the page AFTER.
 *
 * If impersonation is already active (an Admin jumps straight from one
 * impersonated user to another without exiting first), the currently active
 * cookies belong to that impersonated user, NOT the Admin. Re-snapshotting
 * them here would silently overwrite — and permanently lose — the Admin's
 * real backup, so `stopImpersonation` would only ever unwind one hop instead
 * of returning to the Admin. Preserve the original backup across nested
 * calls instead.
 */
export const startImpersonation = (target: ImpersonationTarget): void => {
  const existing = getImpersonation();
  const backup: SessionBackup = existing
    ? existing.backup
    : {
        token: CookieStore.getCookie('token'),
        role: CookieStore.getCookie('role'),
        email: CookieStore.getCookie('email'),
        id: CookieStore.getCookie('id'),
      };

  const state: ImpersonationState = {
    userId: target.user.id,
    email: target.user.email,
    username: target.user.username ?? null,
    roleName: target.user.role?.name ?? null,
    backup,
  };

  sessionStorage.setItem(IMPERSONATION_STORAGE_KEY, JSON.stringify(state));

  CookieStore.setCookie('token', target.jwt, 1);
  CookieStore.setCookie('role', target.user.role?.name ?? 'Guest', 1);
  CookieStore.setCookie('email', target.user.email, 1);
  CookieStore.setCookie('id', String(target.user.id), 1);

  notifyChange();
};

/**
 * Restore the Admin's stashed session and clear impersonation. The caller
 * should reload the page afterwards so every provider re-reads the token.
 */
export const stopImpersonation = (): void => {
  const state = getImpersonation();
  sessionStorage.removeItem(IMPERSONATION_STORAGE_KEY);

  if (state) {
    const restore = (name: keyof SessionBackup) => {
      const value = state.backup[name];
      if (value) {
        CookieStore.setCookie(name, value, 1);
      } else {
        CookieStore.deleteCookie(name);
      }
    };
    restore('token');
    restore('role');
    restore('email');
    restore('id');
  }

  notifyChange();
};
