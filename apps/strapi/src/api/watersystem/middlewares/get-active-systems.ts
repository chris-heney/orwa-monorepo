/**
 * `get-active-systems` middleware
 */

import type { Core } from '@strapi/strapi';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Recomputed per request: as a module constant this was frozen at Strapi boot,
 * so the cutoff drifted further into the past the longer the container ran.
 */
const oneYearAgo = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return formatDate(date);
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    if (ctx.query.active === '1') {
      // Delete the "active" parameter
      delete ctx.query.active;

      // Set the "payment_last_date[gt]" parameter with the current date in ISO format
      ctx.query = {
        filters: {
          payment_last_date: {
            $gt: oneYearAgo(),
          },
        },
      };
    }

    // Proceed to the next middleware/controller
    await next();
  };
};
