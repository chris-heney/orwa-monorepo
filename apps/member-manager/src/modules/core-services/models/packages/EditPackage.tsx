import React from 'react';
import {
    Edit,
    SimpleForm,
} from 'react-admin';
import PackageFormFields from './PackageFormFields';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { updateRecord } from '../../../../_utils/updateRecord';
import { useNotify, useRefresh, useDataProvider } from 'react-admin';
import CustomFormToolbar from '../../../../_components/CustomFormToolbar';
import ModalHeader from '../../../../_components/ModalHeader';

const EditPackage = () => {
    const { isPackageModalOpen, setIsPackageModalOpen } =
        useCoreServiceContext();

    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    return (
        <Edit
            redirect={false}
            resource="package"
            id={isPackageModalOpen.record?.id}
            queryOptions={{
                meta: {
                    populate: ['addons', 'features', 'decks'],
                },
            }}
        >
            <SimpleForm
                toolbar={
                    <CustomFormToolbar
                        redirect={() => {
                            setIsPackageModalOpen({
                                open: false,
                            });
                            return '/core-services';
                        }}
                    />
                }
                onSubmit={(data: any) =>
                    updateRecord(
                        data,
                        isPackageModalOpen.record!,
                        dataProvider,
                        notify,
                        refresh,
                        'package',
                        () =>
                            setIsPackageModalOpen({
                                open: false,
                            })
                    )
                }
                sx={{
                    p: 0,
                }}
            >
                <ModalHeader
                    title="Edit Package"
                    onClose={() => {
                        setIsPackageModalOpen({ open: false });
                    }}
                />
                <PackageFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default EditPackage;
