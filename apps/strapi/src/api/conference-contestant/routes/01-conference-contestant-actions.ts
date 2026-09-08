export default {
  routes: [
    {
      method: "POST",
      path: "/conference-contestants/:documentId/cancel",
      handler: "conference-contestant.cancel",
    },
    {
      method: "POST",
      path: "/conference-contestants/:documentId/restore",
      handler: "conference-contestant.restore",
    },
  ],
};
