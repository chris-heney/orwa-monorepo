import { fetchUtils } from 'react-admin';
import {
  IStrapiRestClient,
  IStrapiRestClientOptions,
  IStrapiRestResponse,
} from './types';
import CookieStore from './CookieStore';
import { extractStrapiErrorMessage } from './strapiErrorMessage';
import { getImpersonateRoleHeader } from '../../../modules/rbac-manager/rolePreview';

/**
 * Rewrite the rejection so `error.message` carries what Strapi actually said.
 *
 * fetchJson only looks at the top-level `json.message`, which Strapi 5 never
 * sets, so every failed write arrived as "" (HTTP/2 has no statusText) and
 * callers fell back to "Error creating <Resource>". Mutating the message in
 * place — rather than building a fresh HttpError — keeps `status`, `body` and
 * the HttpError prototype intact for authProvider.checkError and react-admin's
 * field-error mapping. Every notify in the app reads `error.message`, so this
 * one hop fixes the toast everywhere.
 */
const withStrapiErrorMessage = (error: unknown): never => {
  const httpError = error as { message?: string; body?: unknown };
  const message = extractStrapiErrorMessage(httpError?.body);

  if (message) {
    httpError.message = message;
  }

  throw error;
};

const httpClient: IStrapiRestClient = (
  url,
  options: IStrapiRestClientOptions = {}
): Promise<IStrapiRestResponse> => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = CookieStore.getCookie('token');

  options.headers.set('Authorization', `Bearer ${token}`);

  const impersonateRoleId = getImpersonateRoleHeader();
  if (impersonateRoleId) {
    options.headers.set('X-Impersonate-Role', impersonateRoleId);
  }

  return fetchUtils.fetchJson(url, options).catch(withStrapiErrorMessage);
};

export default httpClient;
