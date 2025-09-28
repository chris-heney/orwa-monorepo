import React from 'react';
import { Dialog } from '@mui/material';
import {
    Edit,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import { updateRecord } from '../../../../_utils/updateRecord';
import TopicFormFields from './TopicFormFields';
import ModalHeader from '../../../../_components/ModalHeader';

interface EditTopicModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    topic: any;
}

export const EditTopicModal: React.FC<EditTopicModalProps> = ({
    open,
    onClose,
    onSuccess,
    topic,
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSuccess = async (updatedRecord?: any) => {
        // Emit PubSub events like the controller does
        onSuccess();
        onClose();
    };

    if (!topic) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm" 
            fullWidth
        >
            <ModalHeader title="Edit Topic" onClose={onClose}/>
            
            <Edit 
                resource="pub-sub-topic" 
                id={topic.id}
                redirect={false}
                mutationMode="pessimistic"
                actions={false}
                component={"div"}
            >
                <SimpleForm
                    onSubmit={(data: any) => {
                        const { isResource, ...rest } = data;
                        return updateRecord(
                            rest,
                            topic,
                            dataProvider,
                            notify,
                            refresh,
                            'pub-sub-topic',
                            handleSuccess,
                        );
                    }}
                    sx={{
                        p: 3,
                        pt: 2,
                    }}          
                >
                    <TopicFormFields />
                </SimpleForm>
            </Edit>
        </Dialog>
    );
};
