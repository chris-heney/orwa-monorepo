export default {
  routes: [
    {
     method: 'POST',
     path: '/conference-notification',
     handler: 'conference-notification.resendNotification',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
