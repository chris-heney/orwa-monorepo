import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const ProjectsCompleted = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/projects"
            icon={CheckCircleIcon}
            title={translate('pos.dashboard.projects_completed')}
            subtitle={value || '-'}
        />
    );
};

export default ProjectsCompleted;
