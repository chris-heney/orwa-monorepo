import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const Leads = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/leads"
            icon={PersonAddIcon}
            title={translate('pos.dashboard.leads')}
            subtitle={value || '-'}
        />
    );
};

export default Leads;
