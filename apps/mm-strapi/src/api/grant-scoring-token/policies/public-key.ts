import crypto from 'crypto';


export default async (policyContext, config, { strapi }) => {

  console.log('strapi', strapi.admin.services['api-token']);

  const accessKey = (policyContext.request.headers?.authorization ?? '').substring('Bearer '.length);

  if ( accessKey === '' ) { return false; }

  console.log('accessKey', accessKey);

  const apiTokenService = strapi.getService('api-token')

  console.log('apiTokenService', apiTokenService);
  console.log('hash', apiTokenService.hash(accessKey));

  const tokens = await strapi.documents('admin::api-token').findMany({ filters: { accessKey } })

  console.log('tokens', tokens);

  if (tokens.length === 0) { return false; }

  if (tokens[0].type === 'full-access') { return true }

  if (policyContext.state.user || policyContext.request.query?.filters?.public_key) {
    return true;
  }

  policyContext.body = { message: 'Unauthorized.  A public_key is required to access this endpoint.' };
  policyContext.status = 401;
  return false;
};