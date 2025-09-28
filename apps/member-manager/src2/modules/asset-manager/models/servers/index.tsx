import { AssetManagerProvider } from '../../AssetManagerContext';
import { CreateServer } from './components/CreateServer';
import { EditServer } from './components/EditServer';
import { ListServers } from './components/ListServers';
import { ShowServer } from './components/ShowServer';

// Wrapped components with AssetManagerProvider
const WrappedServerList = () => (
    <AssetManagerProvider>
        <ListServers />
    </AssetManagerProvider>
);

const WrappedServerCreate = () => (
    <AssetManagerProvider>
        <CreateServer />
    </AssetManagerProvider>
);

const WrappedServerEdit = () => (
    <AssetManagerProvider>
        <EditServer />
    </AssetManagerProvider>
);

const WrappedServerShow = () => (
    <AssetManagerProvider>
        <ShowServer />
    </AssetManagerProvider>
);

// Export as default resource configuration
export default {
    list: WrappedServerList,
    create: WrappedServerCreate,
    edit: WrappedServerEdit,
    show: WrappedServerShow,
    recordRepresentation: 'hostname',
};
