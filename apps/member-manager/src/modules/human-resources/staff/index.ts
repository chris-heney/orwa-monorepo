import GradingIcon from '@mui/icons-material/Grading'
import StaffCreateForm from './StaffCreate'
import StaffList from '../../human-resources/staff/StaffList'
import StaffShow from './StaffShow'
import StaffEdit from './StaffEdit'

export default {
  list: StaffList,
  create: StaffCreateForm,
  edit: StaffEdit,
  show: StaffShow,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
