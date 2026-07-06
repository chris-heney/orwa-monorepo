import * as React from 'react';
import { ToggleButtonGroup } from '@mui/material';
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
export var SmartEditToolbar = function (_a) {
    var size = _a.size;
    return (React.createElement(React.Fragment, null,
        React.createElement(ToggleButtonGroup, { "arial-label": "Smart Replace", size: size },
            React.createElement(AutoCorrectButton, null),
            React.createElement(RephraseButton, null),
            React.createElement(SummarizeButton, null)),
        React.createElement(ContinueButton, { size: size })));
};
