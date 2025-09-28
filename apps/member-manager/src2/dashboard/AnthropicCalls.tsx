import PsychologyIcon from '@mui/icons-material/Psychology';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const AnthropicCalls = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/api-usage/anthropic"
            icon={PsychologyIcon}
            title={translate('pos.dashboard.anthropic_calls')}
            subtitle={value || '-'}
        />
    );
};

export default AnthropicCalls;
