export default {
  routes: [
    {
     method: 'POST',
     path: '/remove-registration',
     handler: 'remove-registration.removeRegistration',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
