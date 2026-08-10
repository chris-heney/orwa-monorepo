/**
 * Self-only RaStore preferences. Dedicated path avoids /api/user/:id clashes.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/my-preferences',
      handler: 'my-preferences.getMine',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/my-preferences',
      handler: 'my-preferences.updateMine',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
