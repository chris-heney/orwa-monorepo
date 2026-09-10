import GradingIcon from '@mui/icons-material/Grading'
import AssociateCreate from './AssociateCreate'
import AssociateEdit from './AssociateEdit'
import { pageView } from '../../../framework/registry'
import { tabRedirect } from '../../../framework/registry'

export default {
  list: tabRedirect('memberships.dashboard', 'associates'),
  create: AssociateCreate,
  edit: AssociateEdit,
  show: pageView('memberships.associateShow'),
  icon: GradingIcon,
  recordRepresentation: 'title',
}
