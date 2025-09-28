import React, { useState } from 'react';
import { Edit, SimpleForm, useRedirect } from 'react-admin';
import AddonFormFields from './AddonFormFields';
import PackageFeatureList from './package-addon/PackageAddonList';
import PackageFeatureGroupList from './package-group-addons/PackageAddonGroupList';
import CreateFeaturePackage from './package-addon/CreateAddonPackage';
import CIWebModal from '../../../../_components/CIModal';
import CreatePackageGroupFeature from './package-group-addons/CreatePackageGroupAddon';
import { updateRecord } from '../../../../_utils/updateRecord';
import { useNotify, useRefresh, useDataProvider } from 'react-admin';
import ModalHeader from '../../../../_components/ModalHeader';

const EditAddon = () => {

    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const [isPackageGroupModalOpen, setIsPackageGroupModalOpen] =
        useState(false);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

    const redirect = useRedirect();

    return (
        <Edit
            redirect={false}
            queryOptions={{
                meta: {
                    populate: [
                        'packages',
                        'packageGroupAddons',
                        'packageAddons',
                        'dependencies',
                    ],
                    raw: false,
                },
            }}
        >
            <SimpleForm
                sx={{
                    p: 0,
                }}
                onSubmit={(data: any) =>
                    updateRecord(
                        data,
                        data,
                        dataProvider,
                        notify,
                        refresh,
                        'addon'
                    )
                }
            >
                <ModalHeader
                    title="Edit Addon"
                    onClose={() => {
                        redirect('/core-services');
                    }}
                />
                <AddonFormFields />
            </SimpleForm>

            <PackageFeatureGroupList
                setIsModalOpen={setIsPackageGroupModalOpen}
            />
            <PackageFeatureList setIsModalOpen={setIsPackageModalOpen} />
            <CIWebModal
                isModalOpen={isPackageGroupModalOpen}
                setIsModalOpen={setIsPackageGroupModalOpen}
            >
                <CreatePackageGroupFeature
                    setIsCreating={setIsPackageGroupModalOpen}
                />
            </CIWebModal>
            <CIWebModal
                isModalOpen={isPackageModalOpen}
                setIsModalOpen={setIsPackageModalOpen}
            >
                <CreateFeaturePackage setIsCreating={setIsPackageModalOpen} />
            </CIWebModal>
        </Edit>
    );
};

export default EditAddon;
