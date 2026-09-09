import GavelIcon from '@mui/icons-material/Gavel';
import type { ModuleManifest } from '../../framework/manifest';
import { pageView } from '../../framework/registry';
import { createAction } from '../../framework/actions';
import TermList from './TermList';
import TermCreate from './TermCreate';
import TermEdit from './TermEdit';

/** Terms Manager — a single tab-less `kind: 'list'` page mounted as the resource list. */
export const termsModule: ModuleManifest = {
  id: 'terms',
  title: 'Terms Manager',
  icon: GavelIcon,
  menu: { label: 'Terms Manager', to: '/terms' },
  permissions: { pathPrefixes: ['/terms'], resources: ['terms'] },
  resources: {
    terms: {
      list: pageView('terms.list'),
      create: TermCreate,
      edit: TermEdit,
      icon: GavelIcon,
      recordRepresentation: 'title',
    },
  },
  pages: [
    {
      id: 'terms.list',
      kind: 'list',
      titleBar: {
        title: 'Terms Manager',
        infoTooltip:
          'Create and tag legal documents shown by TermsGate. Use identifiers like Global, All Conferences, or ORWA Conference ID #N.',
        showCount: true,
      },
      list: {
        resource: 'terms',
        sort: { field: 'updatedAt', order: 'DESC' },
        filtersDrawer: false,
      },
      actions: [createAction('terms', { label: 'Add Term' })],
      body: TermList,
    },
  ],
};

export default termsModule;
