import HandshakeIcon from '@mui/icons-material/Handshake';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const Deals = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/deals"
            icon={HandshakeIcon}
            title={translate('pos.dashboard.deals')}
            subtitle={value || '-'}
        />
    );
};

export default Deals;
