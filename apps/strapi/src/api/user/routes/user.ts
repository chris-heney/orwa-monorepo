export default {
  routes: [
    {
      method: 'GET',
      path: '/user',
      handler: 'user.getUsers',
      config: {
       policies: [],
       middlewares: [],
     },
    }, {
      method: 'PUT',
      path: '/user/:id',
      handler: 'user.update',
      config: {
       policies: [],
       middlewares: [],
     },
    }, {
      method: 'POST',
      path: '/user',
      handler: 'user.create',
      config: {
       policies: [],
       middlewares: [],
     },
    }
  ],
};
