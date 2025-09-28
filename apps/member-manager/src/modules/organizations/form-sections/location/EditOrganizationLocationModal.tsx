import {
    Button,
    Edit,
    SaveButton,
    SimpleForm,
    Toolbar,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import { FieldValues } from 'react-hook-form';
import { CustomHeader } from '../../../../_components';
import CIWebModal from '../../../../_components/CIModal';
import { updateRecord } from '../../../../_utils/updateRecord';
import { OrganizationLocationFormFields } from './OrganizationLocationFormFields';
import { transform } from './utils';

const EditLocationModal = ({
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
            isModalOpen={open.open && open.locationId !== null}
            setIsModalOpen={() =>
                setOpen({
                    open: false,
                    locationId: null,
                })
            }
        >
            <Edit
                queryOptions={{
                    meta: {
                        // populate: ['organizationLocations', 'city'],
                        // @TODO: fix this to populate city and have it work with the form update/create
                        populate: ['organizationLocations', 'city'],
                        raw: true,
                    },
                }}
                resource="location"
                id={open.locationId}
            >
                <SimpleForm
                    onSubmit={(data: FieldValues) => {
                        updateRecord(
                            transform(data, record),
                            transform(data, record),
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
                    toolbar={
                        <Toolbar
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <SaveButton />
                            <Button
                                label="Delete"
                                variant="contained"
                                size="medium"
                                onClick={() => {
                                    setOpen({
                                        open: false,
                                        locationId: null,
                                    });
                                }}
                            />
                        </Toolbar>
                    }
                >
                    <CustomHeader title={`Edit Location for ${record?.name}`} />
                    <OrganizationLocationFormFields />
                </SimpleForm>
            </Edit>
        </CIWebModal>
    );
};

export default EditLocationModal;
