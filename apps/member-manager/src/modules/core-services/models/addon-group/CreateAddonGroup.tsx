import {
    Create,
    SimpleForm,
    useRefresh,
    useNotify,
    useDataProvider,
} from 'react-admin';
import AddonGroupFormFields from './AddonGroupFormFields';
import { createRecord } from '../../../../_utils/createRecord';
import { useCoreServiceContext } from '../../CoreServiceContex';
import ModalHeader from '../../../../_components/ModalHeader';

const CreateAddonGroup = () => {

    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const { setIsAddonGroupModalOpen } = useCoreServiceContext();

    return (
        <Create resource="addon-group" redirect={false}>
            <SimpleForm
                sx={{
                    p: 0,
                }}
                onSubmit={(data: any) => {
                    return createRecord(
                        data,
                        dataProvider,
                        notify,
                        refresh,
                        'addon-group',
                        () =>
                            setIsAddonGroupModalOpen({
                                open: false,
                            })
                    );
                }}
            >
                <ModalHeader
                    title="Create Addon Group"
                    onClose={() => setIsAddonGroupModalOpen({ open: false })}
                />
                <AddonGroupFormFields />
            </SimpleForm>
        </Create>
    );
};

export default CreateAddonGroup;
