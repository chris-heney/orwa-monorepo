import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslate, FormGroupContextProvider } from 'react-admin';
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
export var LongFormSection = React.forwardRef(function LongFormSection(_a, ref) {
    var children = _a.children, label = _a.label, sx = _a.sx;
    var translate = useTranslate();
    return (React.createElement(Root, { ref: ref, sx: sx },
        React.createElement(FormGroupContextProvider, { name: label },
            React.createElement(Typography, { variant: "h4", gutterBottom: true }, translate(label, { _: label })),
            React.createElement(Stack, { className: RaLongFormSection.stack }, children),
            React.createElement(Divider, { sx: { mb: 4 } }))));
});
var PREFIX = 'RaLongFormSection';
export var RaLongFormSection = {
    stack: "".concat(PREFIX, "-stack"),
};
var Root = styled('section', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            width: '100%'
        },
        _b["& .".concat(RaLongFormSection.stack)] = {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            width: 'fit-content',
        },
        _b);
});
