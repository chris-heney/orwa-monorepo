import * as React from 'react';
import { RichTextInput, RichTextInputProps } from 'ra-input-rich-text';
import { SmartRichTextInputToolbar } from './SmartRichTextInputToolbar';
import {
    SmartRichTextInputParamsContext,
    SmartRichTextInputParamsContextType,
} from './SmartRichTextInputParamsContext';

export const SmartRichTextInput = (
    props: RichTextInputProps & SmartRichTextInputParamsContextType
) => {
    const {
        locale,
        stop,
        maxSize,
        temperature,
        meta,
        mutationOptions,
        ...rest
    } = props;
    return (
        <SmartRichTextInputParamsContext.Provider
            value={{
                mutationOptions,
                locale,
                stop,
                maxSize,
                temperature,
                meta,
            }}
        >
            <RichTextInput toolbar={<SmartRichTextInputToolbar />} {...rest} />
        </SmartRichTextInputParamsContext.Provider>
    );
};
