import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const OpenAICalls = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/api-usage/openai"
            icon={SmartToyIcon}
            title={translate('pos.dashboard.openai_calls')}
            subtitle={value || '-'}
        />
    );
};

export default OpenAICalls;
