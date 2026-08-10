export default {
  routes: [
    {
      method: 'GET',
      path: '/user/me/preferences',
      handler: 'user.getMyPreferences',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/user/me/preferences',
      handler: 'user.updateMyPreferences',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/user',
      handler: 'user.getUsers',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/user/:id',
      handler: 'user.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user',
      handler: 'user.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
