import WebIcon from '@mui/icons-material/Language';
import WebsiteTemplateCreate from './WebsiteTemplateCreate';
import WebsiteTemplateEdit from './WebsiteTemplateEdit';
import WebsiteTemplateList from './WebsiteTemplateList';
import WebsiteTemplateShow from './WebsiteTemplateShow';

export default {
    list: WebsiteTemplateList,
    create: WebsiteTemplateCreate,
    edit: WebsiteTemplateEdit,
    show: WebsiteTemplateShow,
    icon: WebIcon,
    recordRepresentation: 'name',
    options: { label: 'Website Templates' },
}; 