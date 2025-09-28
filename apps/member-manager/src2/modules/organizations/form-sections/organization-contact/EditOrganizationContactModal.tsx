import {
    Edit,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import { FieldValues } from 'react-hook-form';
import { CustomHeader } from '../../../../_components';
import CIWebModal from '../../../../_components/CIModal';
import { updateRecord } from '../../../../_utils/updateRecord';
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
            isModalOpen={open.open && open.contactId !== null}
            setIsModalOpen={() =>
                setOpen({
                    open: false,
                    contactId: null,
                })
            }
        >
            <Edit
                queryOptions={{
                    meta: {
                        populate: ['organizationContacts'],
                        raw: true,
                    },
                }}
                resource="contact"
                id={open.contactId}
            >
                <SimpleForm
                    onSubmit={(data: FieldValues) => {
                        updateRecord(
                            transform(data, record),
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
                    <CustomHeader title={`Edit Contact for ${record?.name}`} />
                    <OrganizationContactFormFields />
                </SimpleForm>
            </Edit>
        </CIWebModal>
    );
};

export default EditContactModal;
