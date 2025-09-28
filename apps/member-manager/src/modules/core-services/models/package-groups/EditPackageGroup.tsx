import React from 'react';
import { Edit, SimpleForm } from 'react-admin';
import PackageGroupFormFields from './PackageGroupFormFields';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { updateRecord } from '../../../../_utils/updateRecord';
import { useNotify, useRefresh, useDataProvider } from 'react-admin';
import CustomFormToolbar from '../../../../_components/CustomFormToolbar';
import ModalHeader from '../../../../_components/ModalHeader';

const EditPackageGroup = () => {
    const { isPackageGroupModalOpen, setIsPackageGroupModalOpen } =
        useCoreServiceContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <Edit
            resource="package-group"
            queryOptions={{
                meta: {
                    populate: "coreServices",
                },
            }}
            redirect={false}
            id={isPackageGroupModalOpen.record?.id}
        >
            <SimpleForm
                toolbar={
                    <CustomFormToolbar
                        redirect={() => {
                            setIsPackageGroupModalOpen({ open: false });
                            return '/core-services';
                        }}
                    />
                }
                onSubmit={(data: any) =>
                    updateRecord(
                        data,
                        isPackageGroupModalOpen.record!,
                        dataProvider,
                        notify,         
                        refresh,
                        'packageGroup',
                        () =>
                          setIsPackageGroupModalOpen({
                              open: false,
                          }),
                    )
                }
                sx={{
                    p: 0,
                }}
            >
                <ModalHeader
                        title="Edit Package Group"
                        onClose={() =>
                            setIsPackageGroupModalOpen({ open: false })
                        }
                    />
                <PackageGroupFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default EditPackageGroup;
