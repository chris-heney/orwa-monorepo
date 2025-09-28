import React from 'react';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import AddonFormFields from './AddonFormFields';
import CIWebModal from '../../../../_components/CIModal';
import { useCoreServiceContext } from '../../CoreServiceContex';
import CustomHeader from '../../../../_components/CustomHeader';
import { createRecord } from '../../../../_utils/createRecord';

const CreateAddonModal = () => {
    const { isAddonModalOpen, setIsAddonModalOpen } = useCoreServiceContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    // {
    //     "name": "Additional Blog Post (Copy)",
    //     "description": "Extra blog post beyond package allocation",
    //     "coreServiceId": 3,
    //     "investmentSetup": 0,
    //     "investmentRecurring": 0,
    //     "investmentEa": 1,
    //     "quantity": 1,
    //     "min": 1,
    //     "max": 2,
    //     "investmentFrequency": "MONTHLY",
    //     "createdAt": "2025-06-30T19:31:57.069Z",
    //     "updatedAt": "2025-07-01T21:10:23.537Z",
    //     "packageGroupId": null,
    //     "addonGroup": [
    //         {
    //             "id": 1,
    //             "name": "Test",
    //             "description": "Hey",
    //             "coreServiceId": 3,
    //             "createdAt": "2025-07-01T21:10:55.155Z",
    //             "updatedAt": "2025-07-01T21:10:55.155Z"
    //         }
    //     ],
    //     "packages": [
    //         9
    //     ]
    // }

    // omly send addonGroup id

    return (
        <CIWebModal
            isModalOpen={isAddonModalOpen.open}
            setIsModalOpen={() => setIsAddonModalOpen({ open: false })}
        >
            <Create resource="addon">
                <SimpleForm
                    sx={{
                        p: 0,
                    }}
                    defaultValues={{
                        ...isAddonModalOpen.record,
                        addonGroup: isAddonModalOpen?.record?.addonGroup?.map((addonGroup) => {
                            return {
                                id: addonGroup.id
                            }
                        })
                    }}
                    onSubmit={(data: any) => {
                        // Remove addonGroup if it's an empty array
                        if (Array.isArray(data.addonGroup) && data.addonGroup.length === 0) {
                            delete data.addonGroup;
                        }
                        createRecord(
                            data,
                            dataProvider,
                            notify,
                            refresh,
                            'addon',
                            () => setIsAddonModalOpen({ open: false })
                        );
                    }}
                >
                    <CustomHeader title="Create Addon" />
                    <AddonFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateAddonModal;
