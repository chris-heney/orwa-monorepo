export default {
  routes: [
    {
     method: 'POST',
     path: '/wp-grant-applications',
     handler: 'wp-grant-applications.createGrantApplication',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
