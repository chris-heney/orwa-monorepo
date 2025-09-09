/**
 * A set of functions called "actions" for `test`
 */

export default {

  email: async (ctx, next) => {
    // @see: https://github.com/strapi/strapi/blob/main/packages/core/upload/server/controllers/content-api.js
    //       Marcos: Follow the way their internal controller uses the upload service to upload files.
    // @see: https://bestofjs.org/projects/jspdf
    // @see: https://github.com/parallax/jsPDF


    // 1. Generate the PDF file using JSPDF
    // 2. Upload the PDF file to the Upload service
    // 3. Send the email with the attachment using the Email service


    // use your upload functino from badges to send to strapi

    try {
      const payload = {
        to: 'marcosje2005@gmail.com',
        from: 'ORWA Training <training@orwa.org>',
        // cc: 'valid email address',
        // bcc: 'valid email address',
        replyTo: 'training@orwa.org',
        subject: 'Important DEQ Message',
        text: 'Goodbye world!', // Replace with a valid field ID
        html: 'Hello world!', 
        attachment: [{
          name: 'Training-Guide.pdf',
          url: 'https://data.orwa.org/uploads/50_310_8ca47b3b5b.pdf'
        }]
      };

      await strapi.plugins['email'].services.email.send(payload);

      const from = payload.from;
      const senderEmail = from.match(/<(.*?)>/g) ? from.match(/<(.*?)>/g)?.map((a) => a.replace(/<|>/g, ""))[0] : from;
      const senderName = from.match(/(.*?)</g) ? from.match(/(.*?)</g)?.map((a) => a.replace(/<|>/g, ""))[0] : from;

      console.log(senderEmail);
      console.log(senderName);

      ctx.body = 'ok';

    } catch(err) {
      ctx.body = err;
    }
  }
};
