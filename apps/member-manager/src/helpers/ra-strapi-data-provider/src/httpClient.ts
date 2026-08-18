import { fetchUtils } from 'react-admin';
import {
  IStrapiRestClient,
  IStrapiRestClientOptions,
  IStrapiRestResponse,
} from './types';
import CookieStore from './CookieStore';
import { getImpersonateRoleHeader } from '../../../modules/rbac-manager/rolePreview';

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

  return fetchUtils.fetchJson(url, options);
};

export default httpClient;
