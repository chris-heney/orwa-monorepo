import CodeIcon from '@mui/icons-material/Code';
import PlatformGroupCreateForm from "./CreatePlatformGroup";
import PlatformGroupEditForm from "./EditPlatformGroup";
import PlatformGroupList from "./PlatformGroupsList";

export default {
    list: PlatformGroupList,
    create: PlatformGroupCreateForm,
    edit: PlatformGroupEditForm,
    icon: CodeIcon,
    recordRepresentation: 'title',
};
