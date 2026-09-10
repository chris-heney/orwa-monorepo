import GradingIcon from '@mui/icons-material/Grading'
import CreateMembershipItem from './CreateMembershipItem'
import EditMembershipItem from './EditMembershipItem'
import { pageView } from '../../../framework/registry'
import { tabRedirect } from '../../../framework/registry'

export default {
  list: tabRedirect('memberships.dashboard', 'membership-items'),
  create: CreateMembershipItem,
  edit: EditMembershipItem,
  show: pageView('memberships.membershipItemShow'),
  icon: GradingIcon,
  recordRepresentation: 'title',
}
