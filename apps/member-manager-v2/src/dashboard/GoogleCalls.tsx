import GoogleIcon from '@mui/icons-material/Google';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const GoogleCalls = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/api-usage/google"
            icon={GoogleIcon}
            title={translate('pos.dashboard.google_calls')}
            subtitle={value || '-'}
        />
    );
};

export default GoogleCalls;
