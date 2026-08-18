export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
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
