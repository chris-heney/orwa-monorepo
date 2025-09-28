import {
    Edit,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import CoreServiceFormFields from './AddonGroupFormFields';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { updateRecord } from '../../../../_utils/updateRecord';
import ModalHeader from '../../../../_components/ModalHeader';

const EditAddonGroup = () => {
    const { isAddonGroupModalOpen, setIsAddonGroupModalOpen } =
        useCoreServiceContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    return (
        <Edit
            resource="addon-group"
            mutationMode="pessimistic"
            redirect={false}
            id={isAddonGroupModalOpen.record?.id}
            queryOptions={{
                meta: {
                    populate: ['addons', 'packages'],
                },
            }}
        >
            <SimpleForm
                sx={{
                    p: 0,
                }}
                onSubmit={(data: any) => {
                    return updateRecord(
                        data,
                        isAddonGroupModalOpen.record!,
                        dataProvider,
                        notify,
                        refresh,
                        'addon-group',
                        () => setIsAddonGroupModalOpen({ open: false })
                    );
                }}
            >
                <ModalHeader
                    title="Edit Addon Group"
                    onClose={() => setIsAddonGroupModalOpen({ open: false })}
                />
                <CoreServiceFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default EditAddonGroup;
