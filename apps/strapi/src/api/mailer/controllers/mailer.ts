'use strict';

/**
 * A set of functions called "actions" for `mailer`
 */

// @TODO: https://nodemailer.com/

export default ({strapi}) => ({
  sendEmail: async (ctx, next) => {

    try {
      const { to, from, templateId, variables, html, subject, attachments} = ctx.request.body
    
      if ( !templateId && !html) {
        console.log('Missing post parameters: templateId is required fields.');
        ctx.response.status = 500;

        ctx.response.body = {
          status: 'fail',
          message: 'Missing post parameters: templateId is required fields.'
        };

        return ctx;
      }
         
      const emailTemplate = templateId !== undefined ? await strapi.service('api::email-template.email-template').findOne(templateId, {
        populate: { attachments: true }
      }) : null;


      if ( !emailTemplate && !html ) {
        console.log('Could not find the email template requested.');
        ctx.response.status = 500;
        ctx.response.body = {
          status: 'fail',
          message: 'Could not find the email template requested.'
        };

        return ctx;
      }

      const variableSearch = /{([^}]+)}/g; // Regular expression to find placeholders in the email template

      // Replace each placeholder with its corresponding value from the variables object
      

      const emailTemplateHtml = emailTemplate ? emailTemplate.body.replace(
        variableSearch,
        (match, key) => {
          const replacement = variables[key.trim()];
          return replacement !== undefined ? replacement : match;
        }
      ) : null;

      const subjectTemplate = emailTemplate ? emailTemplate.subject.replace(
        variableSearch,
        (match, key) => {
          const replacement = variables[key.trim()];
          return replacement !== undefined ? replacement : match;
        }
      ) : null;

      const templateAttachments = emailTemplate ? emailTemplate?.attachments?.map((attachment: any) => {
        return {
          name: attachment.name,
          url: `${process.env.STRAPI_API_ENDPOINT}${attachment.url}`
        }
      }) : null;

      const payload = {
        to: to ? to : emailTemplate.to, // emailTemplate.to,
        // to: 'marcosje2005@gmail.com',
        from: from ??  emailTemplate.from_name + `<${emailTemplate.from_email}>`,
        // cc: 'Kbrown@orwa.org',
        // bcc: 'valid email address',
        // replyTo: emailTemplate.cc,
        // subject: subject ? subjectTemplate : '',
        subject: subject ? subject : subjectTemplate,
        // text: 'Goodbye world!', // Replace with a valid field ID
        html: html ? html : emailTemplateHtml,
        attachment: attachments ?? templateAttachments ?? null
      };
      
      // const payload = {
      //   to: 'marcosje2005@gmail.com',
      //   from: 'ORWA Training <training@orwa.org>',
      //   // cc: 'valid email address',
      //   // bcc: 'valid email address',
      //   replyTo: 'training@orwa.org',
      //   subject: 'Important DEQ Message',
      //   text: 'Goodbye world!', // Replace with a valid field ID
      //   html: 'Hello world!', 
      //   attachment: [{
      //     name: 'Training-Guide.pdf',
      //     url: 'https://data.orwa.org/uploads/50_310_8ca47b3b5b.pdf'
      //   }]
      // };
      
      await strapi.plugins['email'].services.email.send(payload); 

      ctx.response.status = 200;
      ctx.response.body = {
        status: 'success',
        message: ctx.response.status
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
})
