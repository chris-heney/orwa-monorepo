import SettingsIcon from '@mui/icons-material/Settings';
import DisplayConditionCreate from './DisplayConditionCreate';
import DisplayConditionEdit from './DisplayConditionEdit';
import DisplayConditionList from './DisplayConditionList';
import DisplayConditionShow from './DisplayConditionShow';

export default {
    list: DisplayConditionList,
    create: DisplayConditionCreate,
    edit: DisplayConditionEdit,
    show: DisplayConditionShow,
    icon: SettingsIcon,
    recordRepresentation: (record: any) => `${record.ruleType}: ${record.field || 'N/A'}`,
};
