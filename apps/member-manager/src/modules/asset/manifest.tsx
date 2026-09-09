import GradingIcon from '@mui/icons-material/Grading';
import type { ModuleManifest } from '../../framework/manifest';
import { pageView } from '../../framework/registry';
import {
  columnsAction,
  createAction,
  exportAction,
} from '../../framework/actions';
import AssetCreate from './AssetCreate';
import AssetEdit from './AssetEdit';
import AssetShow from './AssetShow';
import AssetList, { exportAssets } from './AssetList';

/** Asset Manager — tab-less `kind: 'list'` page as the resource list. */
export const assetsModule: ModuleManifest = {
  id: 'assets',
  title: 'Asset Manager',
  icon: GradingIcon,
  menu: { label: 'Asset Manager', to: '/assets' },
  permissions: {
    pathPrefixes: ['/assets'],
    resources: [
      'assets',
      'shared.field-metas',
      'components_shared_field_metas',
    ],
  },
  resources: {
    assets: {
      list: pageView('assets.list'),
      create: AssetCreate,
      edit: AssetEdit,
      show: AssetShow,
      icon: GradingIcon,
      recordRepresentation: 'name',
    },
    'shared.field-metas': {},
    components_shared_field_metas: {},
  },
  pages: [
    {
      id: 'assets.list',
      kind: 'list',
      titleBar: {
        title: 'Asset Manager',
        infoTooltip:
          'Track tangible and intangible assets, assignments, and fair market value.',
        showCount: true,
      },
      list: {
        resource: 'assets',
        exporter: exportAssets,
        filtersDrawer: false,
      },
      actions: [
        createAction('assets', { label: 'Add Asset' }),
        columnsAction,
        exportAction,
      ],
      body: AssetList,
    },
  ],
};

export default assetsModule;
