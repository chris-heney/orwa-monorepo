import * as React from 'react';
import { useDataProvider, useTranslate } from 'react-admin';
import { useTiptapEditor } from 'ra-input-rich-text';
import { useMutation } from 'react-query';
import { ToggleButton, ToggleButtonProps } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';

import {
    useSmartRichTextInputParamsContext,
    SmartRichTextInputParamsContextType,
} from './SmartRichTextInputParamsContext';

export const ContinueButton = (props: ContinueButtonProps) => {
    const editor = useTiptapEditor();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const { locale, mutationOptions, ...params } =
        useSmartRichTextInputParamsContext(props);

    const { mutateAsync, isLoading } = useMutation(
        async (prompt: string) =>
            dataProvider.getCompletion({
                prompt,
                ...params,
            }),
        mutationOptions
    );

    const replace = async event => {
        event.preventDefault();
        const {
            state: {
                selection: { from },
            },
        } = editor;
        const text =
            from > 1
                ? editor.state.doc.textBetween(0, from, ' ')
                : editor.getText();
        if (!text) return;

        const { data: completion } = await mutateAsync(text);

        if (completion) {
            const cleanCompletion = completion.trim();
            const to = from + cleanCompletion.length;
            editor
                .chain()
                .focus()
                .insertContent(cleanCompletion)
                .setTextSelection({ from, to })
                .run();
        }
    };

    const label = translate('ra.ai.button.complete', { _: 'Continue writing' });
    return (
        <ToggleButton
            aria-label={label}
            title={label}
            value={label}
            onClick={replace}
            disabled={!editor?.isEditable || isLoading}
            selected={isLoading}
            {...sanitizeRestProps(props)}
        >
            <EditNoteIcon fontSize="inherit" />
        </ToggleButton>
    );
};

export interface ContinueButtonProps
    extends SmartRichTextInputParamsContextType,
        Omit<ToggleButtonProps, 'value' | 'onClick'> {}

const sanitizeRestProps = ({
    locale,
    stop,
    maxSize,
    temperature,
    meta,
    mutationOptions,
    ...rest
}: any) => rest;
