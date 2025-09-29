import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const MRRRatio = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/orders"
            icon={TrendingUpIcon}
            title={translate('pos.dashboard.mrr_ratio')}
            subtitle={!!value ? value.toFixed(1) : '-'}
        />
    );
};

export default MRRRatio;
