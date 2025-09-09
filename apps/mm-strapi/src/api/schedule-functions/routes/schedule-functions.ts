export default {
  routes: [
    {
     method: 'PUT',
     path: '/schedule-functions/update-training-schedule',
     handler: 'schedule-functions.updateTrainingSchedule',
     config: {
       policies: [],
       middlewares: [],
     },
    },{
      method: 'POST',
      path: '/schedule-functions/submit-training-schedule',
      handler: 'schedule-functions.submitTrainingSchedule',
      config: {
        policies: [],
        middlewares: [],
      },
     },{
      method: 'POST',
      path: '/schedule-functions/get-training-schedule',
      handler: 'schedule-functions.getTrainingSchedule',
      config: {
        policies: [],
        middlewares: [],
      },
     },
 ],
};
