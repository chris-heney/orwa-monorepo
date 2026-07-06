import * as React from 'react';
import { useDataProvider } from 'react-admin';
import { useTiptapEditor, useEditorSelection } from 'ra-input-rich-text';
import { useMutation } from 'react-query';
import { ToggleButton, ToggleButtonProps } from '@mui/material';

import {
    useSmartRichTextInputParamsContext,
    SmartRichTextInputParamsContextType,
} from './SmartRichTextInputParamsContext';

export const SmartReplaceButton = ({
    promptGenerator,
    label = 'replace',
    Icon,
    ...rest
}: SmartReplaceButtonProps) => {
    const currentTextSelection = useEditorSelection();
    const editor = useTiptapEditor();
    const dataProvider = useDataProvider();
    const { locale, mutationOptions, ...params } =
        useSmartRichTextInputParamsContext(rest);
    const { mutateAsync, isLoading } = useMutation(
        async (text: string) =>
            dataProvider.getCompletion({
                prompt: promptGenerator(text, locale),
                ...params,
            }),
        mutationOptions
    );

    const replace = async event => {
        event.preventDefault();
        const {
            state: {
                selection: { from, to, empty },
            },
        } = editor;
        if (empty) return;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');

        const { data: rephrasedText } = await mutateAsync(selectedText);

        if (rephrasedText) {
            editor
                .chain()
                .focus()
                .deleteSelection()
                .insertContent(rephrasedText.trim())
                // highlight the rephrased text
                .setTextSelection({
                    from,
                    to: from + rephrasedText.trim().length,
                })
                .run();
        }
    };

    return (
        <ToggleButton
            aria-label={label}
            title={label}
            value={label}
            onClick={replace}
            disabled={!editor?.isEditable || !currentTextSelection || isLoading}
            {...rest}
            selected={isLoading}
        >
            {Icon && <Icon fontSize="inherit" />}
        </ToggleButton>
    );
};

export interface SmartReplaceButtonProps
    extends SmartRichTextInputParamsContextType,
        Omit<ToggleButtonProps, 'value' | 'onClick'> {
    promptGenerator: (text: string, locale?: string) => string;
    label?: string;
    Icon?: React.ElementType;
}
