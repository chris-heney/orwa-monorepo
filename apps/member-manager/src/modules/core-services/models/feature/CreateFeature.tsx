import React from 'react';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { createRecord } from '../../../../_utils';
import { CustomHeader } from '../../../../_components';
import FeatureFormFields from './FeatureFormFields';

const CreateFeature = () => {
    const { setIsFeatureModalOpen } = useCoreServiceContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <Create resource="feature">
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
                        'feature',
                        setIsFeatureModalOpen ? () => setIsFeatureModalOpen({ open: false }) : undefined
                    )
                }
            >
                <CustomHeader title="Create Feature" />
                <FeatureFormFields />
            </SimpleForm>
        </Create>
    );
};

export default CreateFeature;
