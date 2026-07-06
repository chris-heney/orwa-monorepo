import * as React from 'react';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import { useTranslate } from 'react-admin';

import {
    SmartReplaceButton,
    SmartReplaceButtonProps,
} from './SmartReplaceButton';

const promptGenerator = (text, locale = 'en') =>
    locale === 'en'
        ? `Correct the misspelled words and grammar errors in the following article delimited by triple quotes.
Do not include triple quotes in the corrected text.
"""${text}"""
`
        : `Here is an article delimited by """ using the ${locale} locale.
Correct the misspelled words and grammar errors.
Keep the original locale. Do not include triple quotes in the corrected text.
"""${text}"""    
`;

export const AutoCorrectButton = (props: AutoCorrectButtonProps) => {
    const translate = useTranslate();
    return (
        <SmartReplaceButton
            promptGenerator={promptGenerator}
            label={translate('ra.ai.button.autoCorrect', { _: 'Auto-correct' })}
            Icon={SpellcheckIcon}
            {...props}
        />
    );
};

export type AutoCorrectButtonProps = Omit<
    SmartReplaceButtonProps,
    'promptGenerator'
>;
