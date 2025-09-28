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
import { OrganizationContactFormFields } from './OrganizationContactFormFields';
import { transform } from './utils';
const EditContactModal = ({
    open,
    setOpen,
}: {
    open: {
        open: boolean;
        contactId: string | null;
    };
    setOpen: (open: { open: boolean; contactId: string | null }) => void;
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useRecordContext();

    return (
        <CIWebModal
            isModalOpen={open.open && open.contactId === null}
            setIsModalOpen={() =>
                setOpen({
                    open: false,
                    contactId: null,
                })
            }
        >
            <Create resource="contact">
                <SimpleForm
                    onSubmit={(data: FieldValues) => {
                        createRecord(
                            transform(data, record),
                            dataProvider,
                            notify,
                            refresh,
                            'contact',
                            () => {
                                setOpen({
                                    open: false,
                                    contactId: null,
                                });
                            }
                        );
                    }}
                    sx={{ p: 0 }}
                >
                    <CustomHeader title={`Add Contact for ${record?.name}`} />
                    <OrganizationContactFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default EditContactModal;
