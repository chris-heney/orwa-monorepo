"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaLongFormSection = exports.LongFormSection = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var react_admin_1 = require("react-admin");
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
exports.LongFormSection = React.forwardRef(function LongFormSection(_a, ref) {
    var children = _a.children, label = _a.label, sx = _a.sx;
    var translate = (0, react_admin_1.useTranslate)();
    return (React.createElement(Root, { ref: ref, sx: sx },
        React.createElement(react_admin_1.FormGroupContextProvider, { name: label },
            React.createElement(material_1.Typography, { variant: "h4", gutterBottom: true }, translate(label, { _: label })),
            React.createElement(material_1.Stack, { className: exports.RaLongFormSection.stack }, children),
            React.createElement(material_1.Divider, { sx: { mb: 4 } }))));
});
var PREFIX = 'RaLongFormSection';
exports.RaLongFormSection = {
    stack: "".concat(PREFIX, "-stack"),
};
var Root = (0, styles_1.styled)('section', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            width: '100%'
        },
        _b["& .".concat(exports.RaLongFormSection.stack)] = {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            width: 'fit-content',
        },
        _b);
});
