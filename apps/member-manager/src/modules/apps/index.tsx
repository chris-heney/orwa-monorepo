import AppsIcon from '@mui/icons-material/Apps';
import AppCreate from './AppCreate';
import AppEdit from './AppEdit';
import AppList from './AppList';
import AppShow from './AppShow';

export default {
    list: AppList,
    create: AppCreate,
    edit: AppEdit,
    show: AppShow,
    icon: AppsIcon,
    recordRepresentation: 'name',
    options: { label: 'Applications' },
};
