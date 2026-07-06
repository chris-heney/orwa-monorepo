import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  sendEmail: async (ctx) => {
    console.log(ctx.request.body);

    try {
      const { to, from, templateId, variables } = ctx.request.body
    
      if ( !templateId) {

        ctx.response.status = 500;

        ctx.response.body = {
          status: 'fail',
          message: 'Missing post parameters: from and templateId are required fields.'
        };

        return ctx;
      }

      console.log('strapi.service', strapi.service('api::email-template.email-template'));
    
      const emailTemplate = await strapi.service('api::email-template.email-template').findOne(templateId);

      console.log('from', emailTemplate.from_name + `<${emailTemplate.from_email}>`)
      if ( !emailTemplate ) {
        ctx.response.status = 500;
        ctx.response.body = {
          status: 'fail',
          message: 'Could not find the email template requested.'
        };

        return ctx;
      }

      const variableSearch = /{([^}]+)}/g; // Regular expression to find placeholders in the email template
      console.log('variables', variables);
      // Replace each placeholder with its corresponding value from the variables object
      const html = emailTemplate.body.replace(variableSearch, (match, key) => {
        const replacement = variables[key.trim()];
        return replacement !== undefined ? replacement : match;
      })

      const subject = emailTemplate.subject.replace(variableSearch, (match, key) => {
        const replacement = variables[key.trim()];
        return replacement !== undefined ? replacement : match;
      })
      console.log('sender email', emailTemplate.from_name + `<${emailTemplate.from_email}>`)
      const payload = {
        to: to,
        from: emailTemplate.from_name + `<${emailTemplate.from_email}>`,
        // cc: 'valid email address',
        // bcc: 'valid email address',
        // replyTo: emailTemplate.cc,
        subject: subject,
        // text: 'Goodbye world!', // Replace with a valid field ID
        html: html
      };
      
      await strapi.plugins['email'].services.email.send(payload); 

      ctx.response.status = 200;
      ctx.response.body = {
        status: 'success',
        message: 'Email Sent Successfully'
      };

	  return ctx;

    } catch (err) {

      console.log('Error', err);

      ctx.response.status = 500

      ctx.response.body = {
        status: 'fail',
        message: err
      };

      return ctx;
    }
  }
});
