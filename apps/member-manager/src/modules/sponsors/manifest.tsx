import BusinessIcon from '@mui/icons-material/Business';
import type { ModuleKey } from '../../config/modules';
import type { ModuleManifest } from '../../framework/manifest';
import { pageView } from '../../framework/registry';
import { createAction, exportAction } from '../../framework/actions';
import { SaveQueryHeaderAction } from '../_components/SavedFiltersSection';
import CorporateSponsorsList from './CorporateSponsorsList';
import CorporateSponsorCreate from './CorporateSponsorCreate';
import CorporateSponsorEdit from './CorporateSponsorEdit';
import CorporateSponsorsFilters from './components/CorporateSponsorsFilters';
import exportCorporateSponsors from './helpers/exportCorporateSponsors';

/**
 * Corporate Sponsors — framework-shaped but NOT registered in
 * `framework/modules.ts`: the `<Resource name="corporate-sponsors">` was
 * already commented out in App.tsx before the framework landed, and enabling
 * it needs a new `ModuleKey` (+ the Strapi `MODULE_KEYS` seed). Add
 * `'corporate-sponsors'` to `ModuleKey`, register this module, and it lights up.
 */
export const corporateSponsorsModule: ModuleManifest = {
  id: 'corporate-sponsors' as ModuleKey,
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
        filterHeaderActions: SaveQueryHeaderAction,
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
