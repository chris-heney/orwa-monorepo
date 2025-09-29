import SchoolIcon from '@mui/icons-material/School';
import ScholarshipApplicationList from './ScholarshipApplicationList';
import CreateScholarshipApplication from './CreateScholarshipApplication';
import EditScholarshipApplication from './EditScholarshipApplication';
import ScholarshipApplicationShow from './ScholarshipApplicationShow';
import { IScholarshipApplication } from './ScholarshipApplicationTypes';

export default {
  list: ScholarshipApplicationList,
  create: CreateScholarshipApplication,
  edit: EditScholarshipApplication,
  show: ScholarshipApplicationShow,
  icon: SchoolIcon,
  recordRepresentation: (record: IScholarshipApplication) => 
    `${record.applicant_first_name} ${record.applicant_last_name}`,
};
