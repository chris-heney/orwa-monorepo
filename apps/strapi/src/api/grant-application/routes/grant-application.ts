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
    {
     method: 'POST',
     path: '/grant-application/request-edit',
     handler: 'grant-application.requestEdit',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'GET',
     path: '/grant-application/edit-session',
     handler: 'grant-application.getEditSession',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
     method: 'PUT',
     path: '/grant-application/edit-session',
     handler: 'grant-application.updateEditSession',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
