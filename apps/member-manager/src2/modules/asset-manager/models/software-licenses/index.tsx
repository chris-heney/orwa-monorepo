import { AssetManagerProvider } from '../../AssetManagerContext';
import { CreateSoftwareLicense } from './components/CreateSoftwareLicense';
import { EditSoftwareLicense } from './components/EditSoftwareLicense';
import { ListSoftwareLicenses } from './components/ListSoftwareLicenses';
import { ShowSoftwareLicense } from './components/ShowSoftwareLicense';

// Wrapped components with AssetManagerProvider
const WrappedSoftwareLicenseList = () => (
    <AssetManagerProvider>
        <ListSoftwareLicenses />
    </AssetManagerProvider>
);

const WrappedSoftwareLicenseCreate = () => (
    <AssetManagerProvider>
        <CreateSoftwareLicense />
    </AssetManagerProvider>
);

const WrappedSoftwareLicenseEdit = () => (
    <AssetManagerProvider>
        <EditSoftwareLicense />
    </AssetManagerProvider>
);

const WrappedSoftwareLicenseShow = () => (
    <AssetManagerProvider>
        <ShowSoftwareLicense />
    </AssetManagerProvider>
);

// Export as default resource configuration
export default {
    list: WrappedSoftwareLicenseList,
    create: WrappedSoftwareLicenseCreate,
    edit: WrappedSoftwareLicenseEdit,
    show: WrappedSoftwareLicenseShow,
    recordRepresentation: 'name',
};
