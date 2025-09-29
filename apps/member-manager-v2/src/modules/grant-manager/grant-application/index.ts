import GradingIcon from '@mui/icons-material/Grading'
import GrantApplicationCreateForm from './CreateGrantApplication'
import GrantApplicationEditForm from './EditGrantApplication'
import GrantApplicationList from './ApplicationList'
import GrantApplicationShow from './GrantApplicationShow'


export default {
  list: GrantApplicationList,
  create: GrantApplicationCreateForm,
  edit: GrantApplicationEditForm,
  show: GrantApplicationShow,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
