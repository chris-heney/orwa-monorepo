import * as React from 'react';
import { useState, ReactNode } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    FormGroupContextProvider,
    RaRecord,
    useFormGroup,
    useTranslate,
} from 'react-admin';
import { useFormState } from 'react-hook-form';

/**
 * Renders children (Inputs) inside a MUI <Accordion> element.
 *
 * To be used as child of an <AccordionForm> element.
 *
 * @param {string} label The main label used as the accordion summary. Appears in red when the accordion has errors
 * @param {string} secondary Optional. The secondary label used as the accordion summary
 * @param {boolean} defaultExpanded Optional. Set to true to have the accordion expanded by default (except if autoClose = true on the parent)
 * @param {boolean} disabled Optional. If true, the accordion will be displayed in a disabled state.
 * @param {boolean} square Optional. If true, rounded corners are disabled.
 *
 * @example
 *
 * import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin';
 * import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';
 *
 * // don't forget the component="div" prop on the main component to disable the main Card
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <AccordionForm>
 *             <AccordionFormPanel label="Identity" defaultExpanded>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </AccordionFormPanel>
 *             <AccordionFormPanel label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </AccordionFormPanel>
 *             <AccordionFormPanel label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </AccordionFormPanel>
 *         </AccordionForm>
 *     </Edit>
 * );
 */
export const AccordionFormPanel = (props: AccordionFormPanelProps) => {
    return (
        <FormGroupContextProvider name={props.label}>
            <AccordionFormPanelView {...props} />
        </FormGroupContextProvider>
    );
};

const AccordionFormPanelView = (props: AccordionFormPanelProps) => {
    const {
        children,
        defaultExpanded = false,
        disabled = false,
        label,
        secondary,
        square,
        // injected by the parent
        autoClose = false,
        onChange,
        expanded,
    } = props;
    const [innerExpanded, setExpanded] = useState<boolean>(defaultExpanded);

    const handleChange = (): void => {
        setExpanded(expanded => !expanded);
    };

    const accordionParams = autoClose
        ? {
              expanded,
              onChange,
          }
        : {
              expanded: innerExpanded,
              onChange: handleChange,
          };

    const translate = useTranslate();
    const formGroup = useFormGroup(label);
    const { isSubmitted } = useFormState();
    const hasErrors =
        !formGroup.isValid && (formGroup.isTouched || isSubmitted);

    return (
        <StyledAccordion
            {...accordionParams}
            disabled={disabled}
            square={square}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${label}-content`}
                id={`panel-${label}-header`}
            >
                <Typography
                    color={hasErrors ? 'error' : 'text.primary'}
                    className={AccordionFormPanelClasses.heading}
                >
                    {translate(label, { _: label })}
                </Typography>
                <Typography
                    className={AccordionFormPanelClasses.secondaryHeading}
                >
                    {secondary && translate(secondary, { _: secondary })}
                </Typography>
            </AccordionSummary>
            <AccordionDetails className={AccordionFormPanelClasses.detail}>
                {children}
            </AccordionDetails>
        </StyledAccordion>
    );
};

export interface AccordionFormPanelProps {
    children: ReactNode;
    defaultExpanded?: boolean;
    disabled?: boolean;
    label: string;
    secondary?: string;
    square?: boolean;
    // injected by the parent
    autoClose?: boolean;
    onChange?: (event: React.ChangeEvent<unknown>, isExpanded: boolean) => void;
    record?: RaRecord;
    resource?: string;
    expanded?: boolean;
}

const PREFIX = 'RaAccordionFormPanel';

export const AccordionFormPanelClasses = {
    heading: `${PREFIX}-heading`,
    secondaryHeading: `${PREFIX}-secondaryHeading`,
    detail: `${PREFIX}-detail`,
};

const StyledAccordion = styled(Accordion, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${AccordionFormPanelClasses.heading}`]: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    [`& .${AccordionFormPanelClasses.secondaryHeading}`]: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    [`& .${AccordionFormPanelClasses.detail}`]: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
    },
}));
