import AssetList from './AssetList';
import AssetCreate from './AssetCreate';
// import AssetEdit from './AssetEdit';
import AssetShow from './AssetShow';
import { CloudUpload as AssetIcon } from '@mui/icons-material';

export default {
    list: AssetList,
    create: AssetCreate,
    show: AssetShow,
    icon: AssetIcon,
    recordRepresentation: 'originalName',
    options: { label: 'Asset Manager' },
};