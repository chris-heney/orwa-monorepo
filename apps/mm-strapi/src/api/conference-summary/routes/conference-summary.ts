export default {
  routes: [
    {
     method: 'GET',
     path: '/conference-summary/:id/:year',
     handler: 'conference-summary.getConferenceSummary',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/conference-summary',
     handler: 'conference-summary.getConferenceSummary',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
