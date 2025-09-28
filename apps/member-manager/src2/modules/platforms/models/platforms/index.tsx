import LayersIcon from '@mui/icons-material/Layers';
import PlatformCreateForm from "./CreatePlatform";
import PlatformEditForm from "./EditPlatform";
import PlatformList from "./PlatformsList";

export default {
    list: PlatformList,
    create: PlatformCreateForm,
    edit: PlatformEditForm,
    icon: LayersIcon,
    recordRepresentation: 'name',
};
