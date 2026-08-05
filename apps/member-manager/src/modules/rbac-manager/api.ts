import { CookieStore } from '../../helpers/ra-strapi-data-provider';
import { ModuleKey } from '../../config/modules';

/**
 * Direct-fetch client for the Strapi users-permissions role endpoints.
 *
 * Do NOT route these calls through the react-admin dataProvider: its `getOne`
 * parses `json.data` (undefined here) and `create`/`update` wrap the body in
 * `{ data: ... }`, which the role controller does not expect. These endpoints
 * take flat bodies and respond with `json.roles` / `json.role` /
 * `json.permissions` / `{ ok: true }`.
 */

export interface PermissionAction {
  enabled: boolean;
  policy?: string;
}

export type PermissionMatrix = Record<
  string,
  { controllers: Record<string, Record<string, PermissionAction>> }
>;

export interface RoleSummary {
  id: number;
  name: string;
  description: string;
  type: string;
  /** Computed by the list endpoint only; absent on GET /roles/:id. */
  nb_users?: number;
  modules: ModuleKey[] | null;
}

export interface RoleDetail extends RoleSummary {
  permissions: PermissionMatrix;
}

export interface RoleBody {
  name: string;
  description?: string;
  modules: ModuleKey[];
  /**
   * Always the COMPLETE matrix. The server replaces the whole permission set
   * on PUT — a partial or missing matrix deletes every omitted permission.
   */
  permissions: PermissionMatrix;
}

const apiBase = `${import.meta.env.VITE_API_ENDPOINT}/api`;

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = CookieStore.getCookie('token');

  const res = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      // Strapi error shape: { error: { message } }
      const json = await res.json();
      message = json?.error?.message || message;
    } catch {
      // Non-JSON error body — keep the status-based message.
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
};

export const getRoles = async (): Promise<RoleSummary[]> => {
  const json = await request<{ roles: RoleSummary[] }>(
    '/users-permissions/roles'
  );
  return json.roles;
};

export const getRole = async (id: number): Promise<RoleDetail> => {
  const json = await request<{ role: RoleDetail }>(
    `/users-permissions/roles/${id}`
  );
  return json.role;
};

export const getPermissionMatrix = async (): Promise<PermissionMatrix> => {
  const json = await request<{ permissions: PermissionMatrix }>(
    '/users-permissions/permissions'
  );
  return json.permissions;
};

export const createRole = (body: RoleBody): Promise<{ ok: boolean }> =>
  request<{ ok: boolean }>('/users-permissions/roles', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const updateRole = (
  id: number,
  body: RoleBody
): Promise<{ ok: boolean }> =>
  request<{ ok: boolean }>(`/users-permissions/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const deleteRole = (id: number): Promise<{ ok: boolean }> =>
  request<{ ok: boolean }>(`/users-permissions/roles/${id}`, {
    method: 'DELETE',
  });
