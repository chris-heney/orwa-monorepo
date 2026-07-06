export default {
  routes: [{
    method: 'GET',
    path: '/sort-fees-watersystems',
    handler: 'sort-fees.sortSystemFees',
    config: {
      policies: [],
      middlewares: [],
    },
  }, {
    method: 'GET',
    path: '/sort-fees-associates',
    handler: 'sort-fees.sortAssociateFees',
    config: {
      policies: [],
      middlewares: [],
    },
  },{
    method: 'GET',
    path: '/my-test',
    handler: 'sort-fees.myTest',
    config: {
      policies: [],
      middlewares: [],
    },
  },],
};
