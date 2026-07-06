import * as React from 'react';
import { useTranslate } from 'react-admin';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import {
    SmartReplaceButton,
    SmartReplaceButtonProps,
} from './SmartReplaceButton';

const promptGenerator = (text, locale = 'en') =>
    locale === 'en'
        ? `Rephrase the following text delimited by triple quotes.
Do not include triple quotes in the corrected text.
"""${text}"""
`
        : `Here is an text delimited by """ using the ${locale} locale. Rephrase it.
Keep the original locale. Do not include triple quotes in the rephrased text.
"""${text}"""

`;

export const RephraseButton = (props: RephraseButtonProps) => {
    const translate = useTranslate();
    return (
        <SmartReplaceButton
            promptGenerator={promptGenerator}
            label={translate('ra.ai.button.rephrase', { _: 'Rephrase' })}
            Icon={AutoAwesomeIcon}
            {...props}
        />
    );
};

export type RephraseButtonProps = Omit<
    SmartReplaceButtonProps,
    'promptGenerator'
>;
