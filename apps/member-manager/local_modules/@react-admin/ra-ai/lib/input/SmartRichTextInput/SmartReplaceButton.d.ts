import * as React from 'react';
import { ToggleButtonProps } from '@mui/material';
import { SmartRichTextInputParamsContextType } from './SmartRichTextInputParamsContext';
export declare const SmartReplaceButton: ({ promptGenerator, label, Icon, ...rest }: SmartReplaceButtonProps) => React.JSX.Element;
export interface SmartReplaceButtonProps extends SmartRichTextInputParamsContextType, Omit<ToggleButtonProps, 'value' | 'onClick'> {
    promptGenerator: (text: string, locale?: string) => string;
    label?: string;
    Icon?: React.ElementType;
}
//# sourceMappingURL=SmartReplaceButton.d.ts.map