import React from 'react';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import PackageGroupFormFields from './PackageGroupFormFields';
import CIWebModal from '../../../../_components/CIModal';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { createRecord } from '../../../../_utils/createRecord';
import ModalHeader from '../../../../_components/ModalHeader';

const CreatePackageGroupModal = () => {
    const { isPackageGroupModalOpen, setIsPackageGroupModalOpen } =
        useCoreServiceContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <CIWebModal
            isModalOpen={isPackageGroupModalOpen.open}
            setIsModalOpen={() => setIsPackageGroupModalOpen({ open: false })}
        >
            <Create resource="package-group">
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
                            'package-group',
                            () => setIsPackageGroupModalOpen({ open: false }),
                        )
                    }
                >
                    <ModalHeader
                        title="Create Package Group"
                        onClose={() =>
                            setIsPackageGroupModalOpen({ open: false })
                        }
                    />
                    <PackageGroupFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreatePackageGroupModal;
