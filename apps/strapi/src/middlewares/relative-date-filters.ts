import type { Core } from '@strapi/strapi';
import {
  hasRelativeDates,
  resolveRelativeDates,
} from '../utils/relative-dates';

/**
 * Expands relative date tokens (`$now-1y`, `$now+1M`, …) in content API query
 * filters — see src/utils/relative-dates.ts for the grammar.
 *
 * Saved queries persist their filters as JSON and are replayed for months, so
 * they store the intent ("within the last year") rather than the two absolute
 * dates that intent happened to mean on the day they were saved. Resolving
 * here means every consumer — the list views, the scheduled-email recipient
 * preview, and any client replaying a saved query — gets the same live window
 * without needing its own date logic.
 *
 * Tokens are only ever produced by our own filter UI; leaving a genuine
 * `$now`-prefixed string value untouched is not a concern because the pattern
 * has to match in full.
 */
export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const filters = ctx.query?.filters;

    if (filters && hasRelativeDates(filters)) {
      ctx.query = {
        ...ctx.query,
        filters: resolveRelativeDates(filters),
      };
    }

    await next();
  };
};
