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
import * as React from 'react';
import { Children, cloneElement, isValidElement, useCallback, useContext, useEffect, useRef, useState, } from 'react';
import { getFormGroupState, Toolbar, FormGroupsContext, useTranslate, } from 'react-admin';
import { useFormState } from 'react-hook-form';
import { Card, CardContent, MenuItem, MenuList } from '@mui/material';
import { styled } from '@mui/material/styles';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { useScrollSpy } from './useScrollSpy';
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
export var LongFormView = function (_a) {
    var children = _a.children, sx = _a.sx, toolbar = _a.toolbar;
    // section refs allow to build the table of contents automatically
    var nbSections = Children.count(children);
    var sectionRefs = useRef(new Array(nbSections));
    // track the scroll to highlight the current section
    var activeSection = useScrollSpy({
        sectionElements: sectionRefs.current,
        offsetPx: -80,
    });
    var translate = useTranslate();
    // track validation state of each group to change toc item color
    var _b = useFormState(), dirtyFields = _b.dirtyFields, touchedFields = _b.touchedFields, errors = _b.errors, isSubmitted = _b.isSubmitted;
    var _c = useState({}), formGroupStates = _c[0], setFormGroupStates = _c[1];
    var formGroups = useContext(FormGroupsContext);
    var updateGroupState = useCallback(function (label) {
        var fields = formGroups.getGroupFields(label);
        var fieldStates = fields
            .map(function (field) {
            return {
                name: field,
                error: get(errors, field, undefined),
                isDirty: get(dirtyFields, field, false),
                isValid: get(errors, field, undefined) == undefined,
                isTouched: get(touchedFields, field, false),
            };
        })
            .filter(function (fieldState) { return fieldState != undefined; }); // eslint-disable-line
        var newState = getFormGroupState(fieldStates);
        setFormGroupStates(function (oldState) {
            var _a;
            if (isEqual(oldState[label], newState)) {
                return oldState;
            }
            return __assign(__assign({}, oldState), (_a = {}, _a[label] = newState, _a));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dirtyFields, errors, touchedFields, formGroups]);
    useEffect(function () {
        // eslint-disable-next-line array-callback-return
        Children.toArray(children).map(function (section) {
            if (!isValidElement(section))
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
    useEffect(function () {
        // Whenever the group content changes (input are added or removed)
        // we must update its state
        var subscriptions = Children.toArray(children).map(function (section) {
            if (!isValidElement(section))
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
        React.createElement(Card, { className: LongFormViewClasses.toc },
            React.createElement(MenuList, null, Children.map(children, function (formSection, index) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return isValidElement(formSection) ? (React.createElement(MenuItem, { selected: activeSection === index, key: index, onClick: function () {
                        window.scrollTo(0, sectionRefs.current[index].offsetTop -
                            60);
                    }, className: !((_b = formGroupStates[(_a = formSection.props) === null || _a === void 0 ? void 0 : _a.label]) === null || _b === void 0 ? void 0 : _b.isValid) &&
                        (((_d = formGroupStates[(_c = formSection.props) === null || _c === void 0 ? void 0 : _c.label]) === null || _d === void 0 ? void 0 : _d.isTouched) ||
                            isSubmitted)
                        ? LongFormViewClasses.error
                        : '' },
                    translate((_e = formSection.props) === null || _e === void 0 ? void 0 : _e.label, {
                        _: (_f = formSection.props) === null || _f === void 0 ? void 0 : _f.label,
                    }),
                    ((_g = formSection.props) === null || _g === void 0 ? void 0 : _g.cardinality)
                        ? " (".concat((_h = formSection === null || formSection === void 0 ? void 0 : formSection.props) === null || _h === void 0 ? void 0 : _h.cardinality, ")")
                        : null)) : null;
            }))),
        React.createElement(Card, { className: LongFormViewClasses.main },
            React.createElement(CardContent, null, Children.map(children, function (formSection, index) {
                return isValidElement(formSection)
                    ? cloneElement(formSection, {
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
            toolbar ? (cloneElement(toolbar, {
                className: LongFormViewClasses.toolbar,
            })) : (React.createElement(Toolbar, { className: LongFormViewClasses.toolbar })))));
};
var PREFIX = 'RaLongForm';
export var LongFormViewClasses = {
    toc: "".concat(PREFIX, "-toc"),
    main: "".concat(PREFIX, "-main"),
    toolbar: "".concat(PREFIX, "-toolbar"),
    error: "".concat(PREFIX, "-error"),
};
var Root = styled('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(LongFormViewClasses.toc)] = { position: 'fixed', width: 200 },
        _b["& .".concat(LongFormViewClasses.main)] = {
            marginLeft: '220px',
            overflow: 'visible',
        },
        _b["& .".concat(LongFormViewClasses.toolbar)] = {
            position: 'sticky',
            bottom: 0,
            zIndex: 2,
        },
        _b["& .".concat(LongFormViewClasses.error)] = {
            color: theme.palette.error.main,
        },
        _b);
});
