import GradingIcon from '@mui/icons-material/Grading'
import CreateInstructorCertification from '../../human-resources/certification/CreateInstructorCertification'
import EditCertification from '../../human-resources/certification/EditCertification'
import ContactShow from '../contacts/ContactShow'

export default {
  list: CreateInstructorCertification,
  create: CreateInstructorCertification,
  show: ContactShow,
  edit: EditCertification,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
