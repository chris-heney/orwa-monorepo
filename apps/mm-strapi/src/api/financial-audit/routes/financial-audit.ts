export default {
  routes: [
    {
      method: 'GET',
      path: '/financial-audit/get-unearned-dues',
      handler: 'financial-audit.getUnearnedDues',
      config: {
        policies: [],
        middlewares: [],
      },
    }, {
     method: 'GET',
     path: '/financial-audit/get-unearned-watersystem-dues',
     handler: 'financial-audit.getUnearnedWatersystemDues',
     config: {
       policies: [],
       middlewares: [],
     },
    }, {
      method: 'GET',
      path: '/financial-audit/get-unearned-associate-dues',
      handler: 'financial-audit.getUnearnedAssociateDues',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
