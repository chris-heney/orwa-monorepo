import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
export declare const AccordionFormView: ({ autoClose, children, className, resource, toolbar, }: AccordionFormViewProps) => React.JSX.Element;
export interface AccordionFormViewProps {
    autoClose?: boolean;
    children?: ReactNode;
    className?: string;
    resource?: string;
    submitOnEnter?: boolean;
    toolbar?: ReactElement;
}
export declare const findAccordionsWithErrors: (children: ReactNode, errors: any) => string[];
//# sourceMappingURL=AccordionFormView.d.ts.map