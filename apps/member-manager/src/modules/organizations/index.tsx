import OrganizationList from './OrganizationList';
import OrganizationCreate from './StartOnboarding';
import OrganizationEdit from './EditOnboarding';
import OrganizationShow from './ShowOnboarding';

export default {
    edit: OrganizationEdit,
    create: OrganizationCreate,
    list: OrganizationList,
    show: OrganizationShow,
    recordRepresentation: 'title',
};