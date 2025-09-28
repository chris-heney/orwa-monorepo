import { AssetManagerProvider } from '../../AssetManagerContext';
import { CreateApiKey } from './components/CreateApiKey';
import { EditApiKey } from './components/EditApiKey';
import { ListApiKeys } from './components/ListApiKeys';
import { ShowApiKey } from './components/ShowApiKey';

// Wrapped components with AssetManagerProvider
const WrappedApiKeyList = () => (
    <AssetManagerProvider>
        <ListApiKeys />
    </AssetManagerProvider>
);

const WrappedApiKeyCreate = () => (
    <AssetManagerProvider>
        <CreateApiKey />
    </AssetManagerProvider>
);

const WrappedApiKeyEdit = () => (
    <AssetManagerProvider>
        <EditApiKey />
    </AssetManagerProvider>
);

const WrappedApiKeyShow = () => (
    <AssetManagerProvider>
        <ShowApiKey />
    </AssetManagerProvider>
);

// Export as default resource configuration
export default {
    list: WrappedApiKeyList,
    create: WrappedApiKeyCreate,
    edit: WrappedApiKeyEdit,
    show: WrappedApiKeyShow,
    recordRepresentation: 'name',
};
