import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import { FieldValues } from 'react-hook-form';
import { CustomHeader } from '../../../../_components';
import CIWebModal from '../../../../_components/CIModal';
import { createRecord } from '../../../../_utils/createRecord';
import { OrganizationLocationFormFields } from './OrganizationLocationFormFields';
import { transform } from './utils';

const CreateLocationModal = ({
    open,
    setOpen,
}: {
    open: {
        open: boolean;
        locationId: string | null;
    };
    setOpen: (open: { open: boolean; locationId: string | null }) => void;
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useRecordContext();

    return (
        <CIWebModal
            isModalOpen={open.open && open.locationId === null}
            setIsModalOpen={() =>
                setOpen({
                    open: false,
                    locationId: null,
                })
            }
        >
            <Create resource="location">
                <SimpleForm
                    onSubmit={(data: FieldValues) => {
                        const transformedData = transform(data, record);
                        createRecord(
                            transformedData,
                            dataProvider,
                            notify,
                            refresh,
                            'location',
                            () => {
                                setOpen({
                                    open: false,
                                    locationId: null,
                                });
                            }
                        );
                    }}
                    sx={{ p: 0 }}
                >
                    <CustomHeader title={`Add Location for ${record?.name}`} />
                    <OrganizationLocationFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateLocationModal;
