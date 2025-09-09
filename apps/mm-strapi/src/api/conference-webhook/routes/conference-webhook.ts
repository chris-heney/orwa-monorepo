export default {
  routes: [
    {
      method: 'POST',
      path: '/conference-webhook',
      handler: 'conference-webhook.registration',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
