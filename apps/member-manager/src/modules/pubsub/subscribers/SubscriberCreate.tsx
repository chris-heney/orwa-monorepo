import React, { useState } from 'react';
import { Create, SimpleForm } from 'react-admin';
import SubscriberFormFields from './components/SubscriberFormFields';
import MergeTagPicker from './components/MergeTagPicker';
import { useMergeTag, MergeTagProvider } from './components/MergeTagContext';
import ModalHeader from '../../../_components/ModalHeader';

function SubscriberCreateContent() {
    const [mergeTagPickerOpen, setMergeTagPickerOpen] = useState(false);
    const { insertTag } = useMergeTag();

    const handleInsertFieldClick = () => {
        setMergeTagPickerOpen(true);
    };

    const handleInsertTag = (tag: string) => {
        insertTag(tag);
        setMergeTagPickerOpen(false);
    };


    return (
        <Create redirect={"edit"} resource="pub-sub-subscriber" title="Create Subscriber">
            <ModalHeader redirect="/pub-sub-subscriber" title="Create Subscriber" backButton />
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
        </Create>
    );
}

export default function SubscriberCreate() {
    return (
        <MergeTagProvider>
            <SubscriberCreateContent />
        </MergeTagProvider>
    );
}
