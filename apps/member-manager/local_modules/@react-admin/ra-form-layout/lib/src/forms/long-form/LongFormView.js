"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongFormViewClasses = exports.LongFormView = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var get_1 = __importDefault(require("lodash/get"));
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var useScrollSpy_1 = require("./useScrollSpy");
/**
 * Form layout for long forms.
 *
 * Renders a fixed table of contents and toolbar, as well as section headers.
 * Expects `<LongForm.Section>` as children, each having a label.
 *
 * @example
 * import { LongForm } from '@react-admin/ra-form-layout';
 *
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <LongForm>
 *             <LongForm.Section label="Identity">
 *                 <Labeled label="id">
 *                     <TextField source="id" />
 *                 </Labeled>
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </LongForm.Section>
 *             <LongForm.Section label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </LongForm.Section>
 *             <LongForm.Section label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </LongForm.Section>
 *         </LongForm>
 *     </Edit>
 * );
 */
var LongFormView = function (_a) {
    var children = _a.children, sx = _a.sx, toolbar = _a.toolbar;
    // section refs allow to build the table of contents automatically
    var nbSections = react_1.Children.count(children);
    var sectionRefs = (0, react_1.useRef)(new Array(nbSections));
    // track the scroll to highlight the current section
    var activeSection = (0, useScrollSpy_1.useScrollSpy)({
        sectionElements: sectionRefs.current,
        offsetPx: -80,
    });
    var translate = (0, react_admin_1.useTranslate)();
    // track validation state of each group to change toc item color
    var _b = (0, react_hook_form_1.useFormState)(), dirtyFields = _b.dirtyFields, touchedFields = _b.touchedFields, errors = _b.errors, isSubmitted = _b.isSubmitted;
    var _c = (0, react_1.useState)({}), formGroupStates = _c[0], setFormGroupStates = _c[1];
    var formGroups = (0, react_1.useContext)(react_admin_1.FormGroupsContext);
    var updateGroupState = (0, react_1.useCallback)(function (label) {
        var fields = formGroups.getGroupFields(label);
        var fieldStates = fields
            .map(function (field) {
            return {
                name: field,
                error: (0, get_1.default)(errors, field, undefined),
                isDirty: (0, get_1.default)(dirtyFields, field, false),
                isValid: (0, get_1.default)(errors, field, undefined) == undefined,
                isTouched: (0, get_1.default)(touchedFields, field, false),
            };
        })
            .filter(function (fieldState) { return fieldState != undefined; }); // eslint-disable-line
        var newState = (0, react_admin_1.getFormGroupState)(fieldStates);
        setFormGroupStates(function (oldState) {
            var _a;
            if ((0, isEqual_1.default)(oldState[label], newState)) {
                return oldState;
            }
            return __assign(__assign({}, oldState), (_a = {}, _a[label] = newState, _a));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirtyFields, errors, touchedFields, formGroups]);
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line array-callback-return
        react_1.Children.toArray(children).map(function (section) {
            if (!(0, react_1.isValidElement)(section))
                return null;
            updateGroupState(section.props.label);
        });
    }, 
    // eslint-disable-next-line
    [
        // eslint-disable-next-line
        JSON.stringify({ dirtyFields: dirtyFields, errors: errors, touchedFields: touchedFields }),
        updateGroupState,
    ]);
    (0, react_1.useEffect)(function () {
        // Whenever the group content changes (input are added or removed)
        // we must update its state
        var subscriptions = react_1.Children.toArray(children).map(function (section) {
            if (!(0, react_1.isValidElement)(section))
                return null;
            return formGroups.subscribe(section.props.label, function () {
                updateGroupState(section.props.label);
            });
        });
        return function () {
            subscriptions.forEach(function (unsubscribe) {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formGroups, updateGroupState]);
    return (React.createElement(Root, { sx: sx },
        React.createElement(material_1.Card, { className: exports.LongFormViewClasses.toc },
            React.createElement(material_1.MenuList, null, react_1.Children.map(children, function (formSection, index) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return (0, react_1.isValidElement)(formSection) ? (React.createElement(material_1.MenuItem, { selected: activeSection === index, key: index, onClick: function () {
                        window.scrollTo(0, sectionRefs.current[index].offsetTop -
                            60);
                    }, className: !((_b = formGroupStates[(_a = formSection.props) === null || _a === void 0 ? void 0 : _a.label]) === null || _b === void 0 ? void 0 : _b.isValid) &&
                        (((_d = formGroupStates[(_c = formSection.props) === null || _c === void 0 ? void 0 : _c.label]) === null || _d === void 0 ? void 0 : _d.isTouched) ||
                            isSubmitted)
                        ? exports.LongFormViewClasses.error
                        : '' },
                    translate((_e = formSection.props) === null || _e === void 0 ? void 0 : _e.label, {
                        _: (_f = formSection.props) === null || _f === void 0 ? void 0 : _f.label,
                    }),
                    ((_g = formSection.props) === null || _g === void 0 ? void 0 : _g.cardinality)
                        ? " (".concat((_h = formSection === null || formSection === void 0 ? void 0 : formSection.props) === null || _h === void 0 ? void 0 : _h.cardinality, ")")
                        : null)) : null;
            }))),
        React.createElement(material_1.Card, { className: exports.LongFormViewClasses.main },
            React.createElement(material_1.CardContent, null, react_1.Children.map(children, function (formSection, index) {
                return (0, react_1.isValidElement)(formSection)
                    ? (0, react_1.cloneElement)(formSection, {
                        ref: function (ref) {
                            if (ref == null) {
                                return;
                            }
                            sectionRefs.current[index] = ref;
                        },
                        key: index,
                    })
                    : null;
            })),
            toolbar ? ((0, react_1.cloneElement)(toolbar, {
                className: exports.LongFormViewClasses.toolbar,
            })) : (React.createElement(react_admin_1.Toolbar, { className: exports.LongFormViewClasses.toolbar })))));
};
exports.LongFormView = LongFormView;
var PREFIX = 'RaLongForm';
exports.LongFormViewClasses = {
    toc: "".concat(PREFIX, "-toc"),
    main: "".concat(PREFIX, "-main"),
    toolbar: "".concat(PREFIX, "-toolbar"),
    error: "".concat(PREFIX, "-error"),
};
var Root = (0, styles_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(exports.LongFormViewClasses.toc)] = { position: 'fixed', width: 200 },
        _b["& .".concat(exports.LongFormViewClasses.main)] = {
            marginLeft: '220px',
            overflow: 'visible',
        },
        _b["& .".concat(exports.LongFormViewClasses.toolbar)] = {
            position: 'sticky',
            bottom: 0,
            zIndex: 2,
        },
        _b["& .".concat(exports.LongFormViewClasses.error)] = {
            color: theme.palette.error.main,
        },
        _b);
});
