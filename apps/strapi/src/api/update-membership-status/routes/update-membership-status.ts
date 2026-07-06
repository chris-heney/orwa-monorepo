export default {
  routes: [
    {
     method: 'GET',
     path: '/update-membership-status',
     handler: 'update-membership-status.updateMembershipStatus',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
