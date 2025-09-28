import { Card } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CustomHeader } from '../../../../_components';
import CIWebModal from '../../../../_components/CIModal';
import OrganizationLocationFormFields from './OrganizationLocationFormFields';

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
    const record = useRecordContext();
    const { control } = useFormContext();

    const { fields } = useFieldArray({
        control: control,
        name: 'organizationLocations',
    });

    console.log('fields', fields);

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
            <Card>
                <CustomHeader title={`Add Location for ${record?.name}`} />
                <OrganizationLocationFormFields index={fields.length - 1} />
            </Card>
        </CIWebModal>
    );
};

export default CreateLocationModal;
