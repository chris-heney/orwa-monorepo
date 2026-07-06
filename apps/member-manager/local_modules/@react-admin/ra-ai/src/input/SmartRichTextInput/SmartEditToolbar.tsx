import * as React from 'react';
import { ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';
import { AutoCorrectButton } from './AutoCorrectButton';
import { RephraseButton } from './RephraseButton';
import { SummarizeButton } from './SummarizeButton';
import { ContinueButton } from './ContinueButton';

/**
 * A toolbar for the TipTap editor that adds AI-based editing features:
 * - auto-correct,
 * - rephrase,
 * - summarize, and
 * - continue writing.
 */
export const SmartEditToolbar = ({ size }: SmartEditToolbarProps) => (
    <>
        <ToggleButtonGroup arial-label="Smart Replace" size={size}>
            <AutoCorrectButton />
            <RephraseButton />
            <SummarizeButton />
        </ToggleButtonGroup>
        <ContinueButton size={size} />
    </>
);

export type SmartEditToolbarProps = Pick<ToggleButtonGroupProps, 'size'>;
