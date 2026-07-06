import GradingIcon from '@mui/icons-material/Grading'
import EditMembership from './EditMembership'
import MembershipsList from './MembershipsList'
import CreateMembership from './CreateMembership'
import MembershipShow from './MembershipShow'

export default {
  list: MembershipsList,
  create: CreateMembership,
  edit: EditMembership,
  show: MembershipShow,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
