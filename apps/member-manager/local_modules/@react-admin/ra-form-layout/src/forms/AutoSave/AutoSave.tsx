import * as React from 'react';
import { useState } from 'react';
import { useTranslate } from 'react-admin';
import { Fade, Typography, TypographyProps, styled } from '@mui/material';
import { useAutoSave } from './useAutoSave';

/**
 * A component that enables autosaving of the form and displays the last save date.
 *
 * @param interval The interval in milliseconds between two autosaves. Defaults to 5000 (5s).
 * @param confirmationDuration The delay in milliseconds before save confirmation message disappears. Defaults to 3000 (3s).
 * @param typographyProps Additional props to pass to the `<Typography>` component that displays the last save time.
 *
 * @example
 * import { AutoSave } from '@react-admin/ra-form-layout';
 * import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';
 *
 * const AutoSaveToolbar = () => (
 *    <Toolbar>
 *       <SaveButton />
 *       <AutoSave />
 *   </Toolbar>
 * );
 *
 * const PostEdit = () => (
 *     <Edit mutationMode="optimistic">
 *         <SimpleForm toolbar={AutoSaveToolbar} resetOptions={{ keepDirtyValues: true }}>
 *             <TextInput source="title" />
 *             <TextInput source="teaser" />
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export const AutoSave = ({
    debounce = 3000,
    confirmationDuration = 3000,
    typographyProps,
}: AutoSaveProps) => {
    const [lastSaveAt, setLastSaveAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const translate = useTranslate();
    const timeoutRef = React.useRef<number>();

    const isSaving = useAutoSave({
        debounce,
        onSuccess: () => {
            setLastSaveAt(new Date());
            setError(null);

            // To avoid TS taking the Node setTimeout instead of the browser one
            const { setTimeout, clearTimeout } = window;

            if (confirmationDuration !== false) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    setLastSaveAt(null);
                }, confirmationDuration);
            }

            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        },
        onError: error => setError(error?.message || error),
    });

    if (error) {
        return (
            <Root
                color="error"
                className={AutoSaveClasses.error}
                {...typographyProps}
            >
                {translate('ra-form-layout.autosave.error', {
                    _: 'Server error, changes are not saved: %{error}',
                    error,
                })}
            </Root>
        );
    }

    if (isSaving) {
        return (
            <Root color="text.secondary" {...typographyProps}>
                {translate('ra-form-layout.autosave.saving', {
                    _: 'Saving...',
                })}
            </Root>
        );
    }

    return (
        <Fade in={!!lastSaveAt}>
            <Root color="text.secondary" {...typographyProps}>
                {translate('ra-form-layout.autosave.last_saved_at', {
                    _: 'All changes saved',
                    lastSaveAt,
                })}
            </Root>
        </Fade>
    );
};

export interface AutoSaveProps {
    debounce?: number;
    confirmationDuration?: number | false;
    typographyProps?: TypographyProps;
}

const PREFIX = 'RaAutoSave';

export const AutoSaveClasses = {
    error: `${PREFIX}-error`,
};

const Root = styled(Typography, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [`&.${AutoSaveClasses.error}`]: {},
}));
