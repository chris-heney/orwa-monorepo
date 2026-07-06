import * as React from 'react';
import { Children, isValidElement, ReactElement, ReactNode } from 'react';
import get from 'lodash/get';
import { Toolbar } from 'react-admin';
import { AccordionFormPanelProps } from './AccordionFormPanel';

export const AccordionFormView = ({
    autoClose = false,
    children,
    className,
    resource,
    toolbar = DefaultToolbar,
}: AccordionFormViewProps) => {
    const childrens = Children.toArray(children);
    const [expanded, setExpanded] = React.useState<string | false>(
        childrens.length > 0 ? (childrens[0] as ReactElement).props.label : ''
    );

    const handleChange =
        (panel: string) =>
        (event: React.ChangeEvent<unknown>, isExpanded: boolean): void => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <>
            <div className={className}>
                {Children.map(
                    children,
                    (accordion: ReactElement<AccordionFormPanelProps>) =>
                        React.isValidElement(accordion)
                            ? React.cloneElement(accordion, {
                                  autoClose,
                                  expanded: expanded === accordion.props.label,
                                  onChange: handleChange(accordion.props.label),
                                  resource,
                              })
                            : null
                )}
            </div>
            {toolbar}
        </>
    );
};

const DefaultToolbar = <Toolbar sx={{ backgroundColor: 'transparent' }} />;

export interface AccordionFormViewProps {
    autoClose?: boolean;
    children?: ReactNode;
    className?: string;
    resource?: string;
    submitOnEnter?: boolean;
    toolbar?: ReactElement;
}

export const findAccordionsWithErrors = (
    children: ReactNode,
    errors
): string[] =>
    Children.toArray(children).reduce<string[]>((acc, child) => {
        if (!isValidElement(child)) {
            return acc;
        }

        const inputs = Children.toArray(child.props.children);

        if (
            inputs.some(
                input =>
                    isValidElement(input) && get(errors, input.props.source)
            )
        ) {
            return [...acc, child.props.label as string];
        }

        return acc;
    }, []);
