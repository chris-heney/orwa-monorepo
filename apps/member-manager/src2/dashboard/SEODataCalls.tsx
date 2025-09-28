import SearchIcon from '@mui/icons-material/Search';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const SEODataCalls = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/api-usage/seo"
            icon={SearchIcon}
            title={translate('pos.dashboard.seo_data_calls')}
            subtitle={value || '-'}
        />
    );
};

export default SEODataCalls;
