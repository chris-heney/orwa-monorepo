import BusinessIcon from '@mui/icons-material/Business';
import type { ModuleManifest } from '../../framework/manifest';
import { pageView } from '../../framework/registry';
import { createAction, exportAction } from '../../framework/actions';
import CorporateSponsorsList from './CorporateSponsorsList';
import CorporateSponsorCreate from './CorporateSponsorCreate';
import CorporateSponsorEdit from './CorporateSponsorEdit';
import CorporateSponsorsFilters from './components/CorporateSponsorsFilters';
import exportCorporateSponsors from './helpers/exportCorporateSponsors';

/**
 * Corporate Sponsors. The `<Resource>` had been commented out in App.tsx
 * before the framework; it is now a registered module with its own
 * `ModuleKey`. NOTE: `'corporate-sponsors'` is not in the Strapi
 * `MODULE_KEYS` seed (apps/strapi/src/index.ts) — existing roles need it
 * granted in RBAC Manager before the menu entry / routes appear for them.
 */
export const corporateSponsorsModule: ModuleManifest = {
  id: 'corporate-sponsors',
  title: 'Corporate Sponsors',
  icon: BusinessIcon,
  menu: { label: 'Corporate Sponsors', to: '/corporate-sponsors' },
  permissions: {
    pathPrefixes: ['/corporate-sponsors'],
    resources: ['corporate-sponsors'],
  },
  resources: {
    'corporate-sponsors': {
      list: pageView('corporate-sponsors.list'),
      create: CorporateSponsorCreate,
      edit: CorporateSponsorEdit,
      icon: BusinessIcon,
      recordRepresentation: 'name',
    },
  },
  pages: [
    {
      id: 'corporate-sponsors.list',
      kind: 'list',
      titleBar: { title: 'Corporate Sponsors', showCount: true },
      list: {
        resource: 'corporate-sponsors',
        perPage: 50,
        meta: { raw: true },
        exporter: (records) =>
          records.length > 0
            ? exportCorporateSponsors(records, 'Corporate-Sponsors')
            : undefined,
        filterBody: CorporateSponsorsFilters,
      },
      actions: [
        createAction('corporate-sponsors', { label: 'Add Corporate Sponsor' }),
        exportAction,
      ],
      body: CorporateSponsorsList,
    },
  ],
};

export default corporateSponsorsModule;
