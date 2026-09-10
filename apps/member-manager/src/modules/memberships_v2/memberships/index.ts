import GradingIcon from '@mui/icons-material/Grading'
import EditMembership from './EditMembership'
import CreateMembership from './CreateMembership'
import { pageView } from '../../../framework/registry'
import { tabRedirect } from '../../../framework/registry'

export default {
  list: tabRedirect('memberships.dashboard', 'memberships'),
  create: CreateMembership,
  edit: EditMembership,
  show: pageView('memberships.membershipShow'),
  icon: GradingIcon,
  recordRepresentation: 'title',
}
