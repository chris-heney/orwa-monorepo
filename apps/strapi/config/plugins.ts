export default ({ env }) => ({
  slugify: {
    enabled: true,
    resolve: "./src/plugins/activity-feed",
  },
  grant: {
    enabled: true,
    resolve: "./src/plugins/grant-management",
  },
  email: {
    config: {
      provider: "strapi-provider-email-brevo",
      providerOptions: {
        apiKey: env("BREVO_API_KEY", "not-set"),
      },
      settings: {
        defaultSenderEmail: "website@orwa.org",
        defaultSenderName: "ORWA",
        defaultReplyTo: "website@orwa.org",
      },
    },
  },
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250mb in bytes
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
    },
  },
});
