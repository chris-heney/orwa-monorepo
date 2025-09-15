export default {
  routes: [
    {
     method: 'POST',
     path: '/grant-application',
     handler: 'grant-application.createGrantApplication',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
