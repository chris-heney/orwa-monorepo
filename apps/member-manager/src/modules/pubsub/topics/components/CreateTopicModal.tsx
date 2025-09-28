import React from 'react';
import { Dialog } from '@mui/material';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import TopicFormFields from './TopicFormFields';
import { createRecord } from '../../../../_utils';
import ModalHeader from '../../../../_components/ModalHeader';

interface EditTopicModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateTopicModal: React.FC<EditTopicModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSuccess = async (updatedRecord?: any) => {
        // Emit PubSub events like the controller does
        onSuccess();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <ModalHeader title="Create Topic" onClose={onClose} />
            <Create
                resource="pub-sub-topic"
                redirect={false}
                mutationMode="pessimistic"
                actions={false}
                component={'div'}
            >
                <SimpleForm
                    onSubmit={(data: any) => {
                        const { isResource, ...rest } = data;
                        createRecord(
                            rest,
                            dataProvider,
                            notify,
                            refresh,
                            'pub-sub-topic',
                            () => handleSuccess()
                        );
                    }}
                    sx={{
                        p: 3,
                        pt: 2,
                    }}
                >
                    <TopicFormFields />
                </SimpleForm>
            </Create>
        </Dialog>
    );
};
