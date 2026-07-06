import * as React from 'react';
import { useTranslate } from 'react-admin';
import CompressIcon from '@mui/icons-material/Compress';

import {
    SmartReplaceButton,
    SmartReplaceButtonProps,
} from './SmartReplaceButton';

const promptGenerator = (text, locale = 'en') =>
    locale === 'en'
        ? `Summarize the following article delimited by triple quotes.
Do not include triple quotes in the corrected text.
"""${text}"""
`
        : `Here is an article delimited by triple quotes using the ${locale} locale. Summarize it.
Keep the original locale. Do not include triple quotes in the rephrased text.
"""${text}"""

`;

export const SummarizeButton = (props: SummarizeButtonProps) => {
    const translate = useTranslate();
    return (
        <SmartReplaceButton
            promptGenerator={promptGenerator}
            label={translate('ra.ai.button.summarize', { _: 'Summarize' })}
            Icon={CompressIcon}
            {...props}
        />
    );
};

export type SummarizeButtonProps = Omit<
    SmartReplaceButtonProps,
    'promptGenerator'
>;
