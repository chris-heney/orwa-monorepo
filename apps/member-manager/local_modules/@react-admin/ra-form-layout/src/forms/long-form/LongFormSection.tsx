import * as React from 'react';
import { ReactNode } from 'react';
import { Divider, Stack, SxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslate, FormGroupContextProvider } from 'react-admin';

export interface LongFormSectionProps {
    label: string;
    cardinality?: number;
    sx?: SxProps;
    children: ReactNode;
}

/**
 * Section of a form to be used as child of a `<LongForm>`.
 *
 * Renders a section title, then its children inside a MUI `<Stack>`,
 * and finally an MUI `<Divider>`.
 *
 * Requires a `label` prop and `children`.
 *
 * @example
 * import { TextInput } from 'react-admin';
 * import { LongFormSection } from '@react-admin/ra-form-layout';
 *
 * const IdentitySection = () => (
 *     <LongFormSection label="Identity">
 *         <TextInput source="first_name" />
 *     </LongFormSection>
 * );
 */
export const LongFormSection = React.forwardRef<
    HTMLElement,
    LongFormSectionProps
>(function LongFormSection({ children, label, sx }: LongFormSectionProps, ref) {
    const translate = useTranslate();
    return (
        <Root ref={ref} sx={sx}>
            <FormGroupContextProvider name={label}>
                <Typography variant="h4" gutterBottom>
                    {translate(label, { _: label })}
                </Typography>
                <Stack className={RaLongFormSection.stack}>{children}</Stack>
                <Divider sx={{ mb: 4 }} />
            </FormGroupContextProvider>
        </Root>
    );
});

const PREFIX = 'RaLongFormSection';

export const RaLongFormSection = {
    stack: `${PREFIX}-stack`,
};

const Root = styled('section', {
    name: PREFIX,
    overridesResolver: (props: any, styles) => styles.root,
})(({ theme }) => ({
    width: '100%',
    [`& .${RaLongFormSection.stack}`]: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 'fit-content',
    },
}));
