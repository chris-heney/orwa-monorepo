import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const ProjectsStarted = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();

    return (
        <CardWithIcon
            to="/projects"
            icon={PlayArrowIcon}
            title={translate('pos.dashboard.projects_started')}
            subtitle={value || '-'}
        />
    );
};

export default ProjectsStarted;
