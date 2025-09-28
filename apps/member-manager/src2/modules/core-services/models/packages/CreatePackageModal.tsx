import React from 'react';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import PackageFormFields from './PackageFormFields';
import CIWebModal from '../../../../_components/CIModal';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { createRecord } from '../../../../_utils/createRecord';
import ModalHeader from '../../../../_components/ModalHeader';
const CreatePackageModal = () => {
    const { isPackageModalOpen, setIsPackageModalOpen } =
        useCoreServiceContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <CIWebModal
            isModalOpen={isPackageModalOpen.open}
            setIsModalOpen={() => setIsPackageModalOpen({ open: false })}
        >
            <Create resource="package">
                <SimpleForm
                    sx={{
                        p: 0,
                    }}
                    onSubmit={(data: any) =>
                        createRecord(
                            data,
                            dataProvider,
                            notify,
                            refresh,
                            'package',
                            () => setIsPackageModalOpen({ open: false }),
                        )
                    }
                >
                    <ModalHeader
                        title="Create Package"
                        onClose={() =>
                            setIsPackageModalOpen({ open: false })
                        }
                    />
                    <PackageFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreatePackageModal;
