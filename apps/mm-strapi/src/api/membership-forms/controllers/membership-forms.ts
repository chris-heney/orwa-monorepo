/**
 * A set of functions called "actions" for `membership-forms`
 */

const getUserAgent = (ctx) => {
  return ctx.request.headers['user-agent']
}

export default ({ strapi }) => ({
  watersystemMembershipApplication: async (ctx) => {
    try {
      // validate conference id and year are sent:

      const watersystemMembershipApplication = await strapi
        .service("api::membership-forms.membership-forms")
        .watersystemMembershipApplication({...ctx.request.body, user_agent: getUserAgent(ctx)});

      ctx.body = watersystemMembershipApplication;
    } catch (err) {
      ctx.status = 500;
      ctx.body = {
        message: "error",
        error: err.message,
      };
    }
  },

  associateMembershipApplication: async (ctx) => {

    try {

      const associateMembershipApplication = await strapi
        .service("api::membership-forms.membership-forms")
        .associateMembershipApplication({...ctx.request.body, user_agent: getUserAgent(ctx)});

      ctx.body =  associateMembershipApplication

    } catch (err) {
      ctx.status

      console.log("err", err);
      ctx.body = {
        message: "error",
        error: err.message,
      };
    }
  },

  watersystemMembershipRenewal: async (ctx) => {
    try {

      console.log("Watersystem Renewal Submitted", ctx.request.body);

      const watersystemMembershipRenewal = await strapi
      .service("api::membership-forms.membership-forms")
      .watersystemMembershipRenewal({...ctx.request.body, user_agent: getUserAgent(ctx)});

      ctx.body = watersystemMembershipRenewal;
    } catch (err) {
      ctx.status = 500;
      ctx.body = {
        message: "error",
        error: err.message,
      };
    }
  },

  associateMembershipRenewal: async (ctx) => {
    try {
  
      const associateMembershipRenewal = await strapi
        .service("api::membership-forms.membership-forms")
        .associateMembershipRenewal({...ctx.request.body, user_agent: getUserAgent(ctx)});

      ctx.body = associateMembershipRenewal

    } catch (err) {
      ctx.status = 500;
      ctx.body = {
        message: "error",
        error: err.message,
      };
    }
  },
});
