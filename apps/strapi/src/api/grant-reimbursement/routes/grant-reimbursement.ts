export default {
  routes: [
    {
      method: "POST",
      path: "/grant-reimbursement/request-link",
      handler: "grant-reimbursement.requestLink",
      config: { policies: [], middlewares: [] },
    },
    {
      method: "GET",
      path: "/grant-reimbursement/session",
      handler: "grant-reimbursement.getSession",
      config: { policies: [], middlewares: [] },
    },
    {
      method: "POST",
      path: "/grant-reimbursement/submit",
      handler: "grant-reimbursement.submit",
      config: { policies: [], middlewares: [] },
    },
  ],
};
