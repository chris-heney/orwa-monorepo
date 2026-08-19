export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io',
          ],
          'media-src': ["'self'", 'data:', 'blob:'],
          // Allow the member-manager frontend to embed uploads (PDF preview
          // iframes). Localhost is included only for local dev servers.
          'frame-ancestors': [
            "'self'",
            'https://orwa.org',
            ...(process.env.NODE_ENV !== 'production'
              ? ['http://localhost:*', 'http://127.0.0.1:*']
              : []),
          ],
          upgradeInsecureRequests: null,
        },
      },
      // Modern browsers ignore X-Frame-Options when frame-ancestors is set,
      // but koa-helmet would still send SAMEORIGIN, which some logic honors.
      frameguard: false,
    },
  },
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  //  'strapi::body',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb', // modify form body
      jsonLimit: '256mb', // modify JSON body
      textLimit: '256mb', // modify text body
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  // Must come after strapi::body: it rewrites numeric relation ids in parsed bodies.
  'global::numeric-id-compat',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
