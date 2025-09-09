/**
 * `get-active-systems` middleware
 */


const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default (config, { strapi }) => {

  // Add your own logic here.
  return async (ctx, next) => {

    if (ctx.query.active === '1') {
      // Delete the "active" parameter
      delete ctx.query.active;

      // Set the "payment_last_date[gt]" parameter with the current date in ISO format
      ctx.query = {
        filters : {
          payment_last_date: {
            '$gt': formatDate(oneYearAgo)
          },
        }
      }
    }

    // Proceed to the next middleware/controller
    return next();
  };  
};
