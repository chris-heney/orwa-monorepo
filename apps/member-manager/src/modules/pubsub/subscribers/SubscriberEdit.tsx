import React, { useState } from 'react';
import { Edit, SimpleForm } from 'react-admin';
import SubscriberFormFields from './components/SubscriberFormFields';
import MergeTagPicker from './components/MergeTagPicker';
import { useMergeTag, MergeTagProvider } from './components/MergeTagContext';
import ModalHeader from '../../../_components/ModalHeader';

function SubscriberEditContent() {
    const [mergeTagPickerOpen, setMergeTagPickerOpen] = useState(false);
    const { insertTag } = useMergeTag();

    // Watch the resource field to get the selected resource type

    const handleInsertFieldClick = () => {
        setMergeTagPickerOpen(true);
    };

    const handleInsertTag = (tag: string) => {
        insertTag(tag);
        setMergeTagPickerOpen(false);
    };

    return (
        <Edit redirect={false} actions={false} resource="pub-sub-subscriber" title="Edit Subscriber">
            <ModalHeader redirect="/pub-sub-subscriber" title="Edit Subscriber" showButton backButton />
            <SimpleForm>
                <SubscriberFormFields
                    onInsertFieldClick={handleInsertFieldClick}
                />
                <MergeTagPicker
                    open={mergeTagPickerOpen}
                    onClose={() => setMergeTagPickerOpen(false)}
                    onInsertTag={handleInsertTag}
                />
            </SimpleForm>
        </Edit>
    );
}

export default function SubscriberEdit() {
    return (
        <MergeTagProvider>
            <SubscriberEditContent />
        </MergeTagProvider>
    );
}
