import * as React from 'react';
import { ComponentType, useState } from 'react';
import clsx from 'clsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'react-admin';
import { useFormState } from 'react-hook-form';
import get from 'lodash/get';
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    AccordionProps,
    AccordionDetailsProps,
    AccordionSummaryProps,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Renders children (Inputs) inside a MUI <Accordion> element without a Card style.
 *
 * To be used as child of a <SimpleForm> or a <TabbedForm> element.
 *
 * @param {string} label The main label used as the accordion summary. Appears in red when the accordion has errors
 * @param {string} secondary Optional. The secondary label used as the accordion summary
 * @param {boolean} fullWidth Optional. If true, the Accordion take the entire form width.
 * @param {string} className Optional. A class name to style the underlying <Accordion>.
 * @param {object} classes Optional. Override styles of the <Accordion>, the <AccordionSummary> and the <AccordionDetails> internal components.
 * @param {boolean} defaultExpanded Optional. Set to true to have the accordion expanded by default.
 * @param {boolean} disabled Optional. If true, the accordion will be displayed in a disabled state.
 * @param {boolean} square Optional. If true, rounded corners are disabled.
 * @param {ReactElement} TransitionComponent Optional. The MUI component used for the transition.
 * @param {object} TransitionProps Optional. If true, rounded corners are disabled.
 *
 * @example
 *
 * import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleForm, SimpleFormIterator, BooleanInput } from 'react-admin';
 * import { AccordionSection } from '@react-admin/ra-form-layout';
 *
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <SimpleForm>
 *              <Labeled label="id">
 *                  <TextField source="id" />
 *             </Labeled>
 *             <TextInput source="first_name" validate={required()} />
 *             <TextInput source="last_name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput source="sex" choices={sexChoices} />
 *             <AccordionSection label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </AccordionSection>
 *             <AccordionSection label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </AccordionSection>
 *         </SimpleFormForm>
 *     </Edit>
 * );
 *
 */
export const AccordionSection = (props: AccordionSectionProps) => {
    const {
        Accordion = DefaultAccordion,
        AccordionDetails = DefaultAccordionDetails,
        AccordionSummary = DefaultAccordionSummary,
        children,
        className,
        defaultExpanded = false,
        disabled = false,
        fullWidth = false,
        label,
        secondary,
        square,
        TransitionComponent,
        TransitionProps,
        // injected by the parent
        resource,
        ...rest
    } = props;
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
    const translate = useTranslate();
    const { errors } = useFormState();

    const handleChange = (): void => {
        setExpanded(expanded => !expanded);
    };
    const hasErrors = hasInputsWithError(children, errors);

    return (
        <Accordion
            {...rest}
            expanded={expanded}
            onChange={handleChange}
            disabled={disabled}
            square={square}
            className={clsx(className, {
                [AccordionSectionClasses.fullWidth]: fullWidth,
            })}
            TransitionComponent={TransitionComponent}
            TransitionProps={TransitionProps}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${label}-content`}
                id={`panel-${label}-header`}
                className={AccordionSectionClasses.summary}
            >
                <Typography
                    color={hasErrors ? 'error' : 'text.primary'}
                    className={AccordionSectionClasses.heading}
                >
                    {translate(label, { _: label })}
                </Typography>
                <Typography
                    className={AccordionSectionClasses.secondaryHeading}
                >
                    {secondary && translate(secondary, { _: secondary })}
                </Typography>
            </AccordionSummary>
            <AccordionDetails className={AccordionSectionClasses.detail}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};

export const hasInputsWithError = (
    children: React.ReactNode,
    errors: unknown
): boolean =>
    React.Children.toArray(children).some(
        input => React.isValidElement(input) && get(errors, input.props.source)
    );

const PREFIX = 'RaAccordionSection';

export const AccordionSectionClasses = {
    heading: `${PREFIX}-heading`,
    secondaryHeading: `${PREFIX}-secondaryHeading`,
    summary: `${PREFIX}-summary`,
    detail: `${PREFIX}-detail`,
    fullWidth: `${PREFIX}-fullWidth`,
};

const StyledAccordion = styled(MuiAccordion, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${AccordionSectionClasses.heading}`]: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    [`& .${AccordionSectionClasses.secondaryHeading}`]: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    [`& .${AccordionSectionClasses.summary}`]: {},
    [`& .${AccordionSectionClasses.detail}`]: {
        display: 'block',
    },
    [`&.${AccordionSectionClasses.fullWidth}`]: {
        width: '100%',
    },
}));

const DefaultAccordion = styled(StyledAccordion)(({ theme }) => ({
    width: theme.spacing(55),
    marginBottom: -1,
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:last-child.Mui-expanded': {
        marginBottom: theme.spacing(2),
    },
    '&:before': {
        display: 'none',
    },
    expanded: {},
}));

const DefaultAccordionSummary = styled(MuiAccordionSummary)(() => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    marginBottom: -1,
    '&.Mui-expanded': {
        backgroundColor: 'rgba(0, 0, 0, .05)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
    },
    '&, &.Mui-expanded': {
        minHeight: 56,
        '.MuiAccordionSummary-content': {
            margin: 0,
        },
    },
    expanded: {},
}));

const DefaultAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    root: {
        padding: theme.spacing(2),
    },
}));

export interface AccordionSectionProps extends Omit<AccordionProps, 'classes'> {
    Accordion?: ComponentType<AccordionProps>;
    AccordionDetails?: ComponentType<AccordionDetailsProps>;
    AccordionSummary?: ComponentType<AccordionSummaryProps>;
    label?: string;
    secondary?: string;
    fullWidth?: boolean;
    record?: any;
    resource?: any;
}

export default AccordionSection;
