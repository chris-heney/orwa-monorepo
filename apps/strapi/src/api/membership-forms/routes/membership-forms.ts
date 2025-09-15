export default {
  routes: [
    {
      method: "POST",
      path: "/membership-forms/watersystem",
      handler: "membership-forms.watersystemMembershipApplication",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/membership-forms/watersystem-renewal",
      handler: "membership-forms.watersystemMembershipRenewal",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/membership-forms/associate",
      handler: "membership-forms.associateMembershipApplication",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/membership-forms/associate-renewal",
      handler: "membership-forms.associateMembershipRenewal",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
