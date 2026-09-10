import GradingIcon from '@mui/icons-material/Grading'
import AssociateCreate from './AssociateCreate'
import AssociateEdit from './AssociateEdit'
import { pageView } from '../../../framework/registry'
import { redirectToMembershipsTab } from '../componenets/RedirectToTab'

export default {
  list: redirectToMembershipsTab('associates'),
  create: AssociateCreate,
  edit: AssociateEdit,
  show: pageView('memberships.associateShow'),
  icon: GradingIcon,
  recordRepresentation: 'title',
}
