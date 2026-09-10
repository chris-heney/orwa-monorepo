import GradingIcon from '@mui/icons-material/Grading'
import EditMembership from './EditMembership'
import CreateMembership from './CreateMembership'
import { pageView } from '../../../framework/registry'
import { redirectToMembershipsTab } from '../componenets/RedirectToTab'

export default {
  list: redirectToMembershipsTab('memberships'),
  create: CreateMembership,
  edit: EditMembership,
  show: pageView('memberships.membershipShow'),
  icon: GradingIcon,
  recordRepresentation: 'title',
}
