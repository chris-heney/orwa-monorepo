export default {
  routes: [{
    method: 'GET',
    path: '/test',
    handler: 'test.email',
    config: {
      auth: false,
      policies: [],
      middlewares: [],
    }
  }], 
};
